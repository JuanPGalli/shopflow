import { Link } from 'react-router-dom';
import styles from './Product.module.css';
import { addToCart, createOrder } from '../../redux/actions/action';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/AuthContext';

export const Product = (props) => {
  const { id, name, description, image, price, category } = props;
  const dispatch = useDispatch();
  const auth = useAuth();
  const email = auth.user?.email;

  const handleAddtoCart = (e) => {
    e.stopPropagation(); // 🔹 previene navegación a /detail/${name} si está dentro de Link
    const quantityToadd = 1;
    dispatch(addToCart(props, quantityToadd));
  };
  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!email) {
      alert('Inicia sesión para comprar.');
      return;
    }
    const items = [{ id, name, price, image, quantity: 1 }];
    dispatch(createOrder([items, { email }]));
  };

  const capitalizeFirstLetter = (str) => {
    //para poner la primera letra de la lista de categs en mayuscula
    if (str.length === 0) {
      return str; // Devuelve una cadena vacía si la cadena de entrada es vacía
    }
    const firstLetter = str.charAt(0).toUpperCase(); // Convierte la primera letra en mayúscula
    const restOfString = str.slice(1).toLowerCase(); // Convierte el resto de la cadena en minúscula
    return firstLetter + restOfString; // Devuelve la cadena resultante
  };

  return (
    <div className={styles.contenedor}>
      <Link to={`/products/detail/${name}`} className={styles.link}>
        <div className={styles.contenedorImagen}>
          <img className={styles.imagen} src={image} alt={name} />
        </div>
        <p className={styles.nombre}>{name}</p>
        <p className={styles.descripcion}>{description}</p>
        <p className={styles.precio}>$ {price}</p>
        <p className={styles.categoria}>{capitalizeFirstLetter(category)}</p>
      </Link>

      <div className={styles.btnCont}>
        <button className={styles.btnCart} onClick={handleAddtoCart}>
          Añadir al carrito
        </button>

        <button className={styles.btnBuy} onClick={handleBuyNow}>
          Comprar
        </button>
      </div>
    </div>
  );
};
