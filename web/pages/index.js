import Head from "next/head";
import useSWR from "swr";
import axios from "axios";
import styled from "@emotion/styled";

const Container = styled.div({
  maxWidth: 1000,
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  margin: "0 auto",
  paddingTop: "1rem",
});

const ProductsWrapper = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 10,
});

const ProductContainer = styled.div({
  width: 240,
  background: "#f4f4f4",
  padding: 5,
  height: 300,
  display: "flex",
  flexDirection: "column",
});

const ProductName = styled.h2({
  marginBottom: 10,
});

const ProductDescription = styled.p({
  flexGrow: 1,
});

const ProductPrice = styled.p({
  textAlign: "end",
});

const fetcher = (url) => axios.get(url).then((res) => res.data);

const handleDelete = (id) => {
  axios.delete(`http://localhost:5000/api/v1/products/${id}`);
};

export default function Home() {
  const { data, error } = useSWR(
    "http://localhost:5000/api/v1/products",
    fetcher
  );

  if (error) return <Container>Failed to load</Container>;
  if (!data) return <Container>Loading...</Container>;

  const products = data.data;

  return (
    <>
      <Container>
        <Head>
          <title>Deno NextJS PostgreSQL</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1>Our Items</h1>
        <ProductsWrapper>
          {products &&
            products.map((product) => (
              <ProductContainer key={product.id}>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>{product.description}</ProductDescription>
                <ProductPrice>
                  {product.price} {product.currency}
                </ProductPrice>
                <div>
                  <button onClick={() => console.log("update")}>Update</button>
                  <button onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </div>
              </ProductContainer>
            ))}
        </ProductsWrapper>
      </Container>
    </>
  );
}
