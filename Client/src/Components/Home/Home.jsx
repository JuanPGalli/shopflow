import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, getCateg } from '../../redux/actions/action';
import Pagination from '../Pagination/Pagination';
import { Product } from '../Product/Product';
import FilterProducts from '../FilterProducts/FilterProducts';
import styles from "./Home.module.css"

export const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct());
    dispatch(getCateg());
  }, [dispatch]);

  const products = useSelector((state) => state.products);
  const categ = useSelector((state) => state.categ);

  const [page, setPage] = useState(1);
  const cardsPerPage = 8;

  const activeProducts = products.filter((product) => product.state === true);
  const totalItems = activeProducts.length;

  const getCurrentPageProducts = () => {
    const startIndex = (page - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    return activeProducts.slice(startIndex, endIndex);
  };

  return (
    <div className={styles.conteiner}>
      <FilterProducts categ={categ} products={products} />

      <div className={styles.contenedor}>
        {getCurrentPageProducts().map((producto) => (
          <Product
            key={producto.id}
            id={producto.id}
            name={producto.name}
            description={producto.description}
            image={producto?.image}
            price={producto.price}
            category={producto.category}
          />
        ))}
      </div>

      <div className={styles.pagination}>
        <Pagination page={page} setPage={setPage} itemsPerPage={cardsPerPage} totalItems={totalItems} />
      </div>
    </div>
  )
}