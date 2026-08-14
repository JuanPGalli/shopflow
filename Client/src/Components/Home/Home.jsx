import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./Home.module.css"

// Minimal landing page. The real product catalog lives at /products
// (Products.jsx) — this route is just an entry point for now, kept
// deliberately simple until the ShopFlow rebrand.
export const Home = () => {
  return (
    <div className={styles.conteiner}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Bienvenidos a ShopFlow</h1>
        <Link to="/products">
          <button className={styles.ctaButton}>Ingresar</button>
        </Link>
      </div>
    </div>
  )
}
