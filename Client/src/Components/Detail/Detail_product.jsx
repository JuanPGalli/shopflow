import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createOrder,
  getProductByName,
  getReviews,
  getAllBuysForUser,
} from '../../redux/actions/action';
import styles from './Detail_product.module.css';
import { addToCart, getUserByEmail } from '../../redux/actions/action';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Loader from '../loader/loader';
// import CreateProduct from "../CreateProduct/CreateProduct";

export const DetailProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detailProduct = useSelector((state) => state.detailProduct);
  const reviewState = useSelector((state) => state.review);
  const review = useMemo(() => reviewState || [], [reviewState]);
  const auth = useAuth();
  const email = auth.user?.email;

  useEffect(() => {
    if (email) {
      dispatch(getUserByEmail(email));
    } else {
      dispatch(getUserByEmail('logout'));
    }
  }, [dispatch, email]);

  const currentUser = useSelector((state) => state.userData);
  const isAdmin = currentUser.userAdmin;

  const { name } = useParams();
  const [loading, setLoading] = useState(true);
  const [isReviewPopupOpen, setReviewPopupOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isReviewButtonEnabled, setReviewButtonEnabled] = useState(false);
  const [buys, setBuys] = useState([]);
  const [ratingError, setRatingError] = useState('');
  const [commentError, setCommentError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!email) {
          setBuys([]);
          return;
        }
        const buyData = await dispatch(getAllBuysForUser(email)); // <-- importante: dispatch
        setBuys(buyData || []);
      } catch (error) {
        console.error('Error cargando compras del usuario', error);
        setBuys([]);
      }
    };

    fetchData();
  }, [dispatch, email]);

  // currentUser (from Redux, kept in sync by the getUserByEmail effect
  // above whenever `email` changes) already has everything this used
  // to duplicate with a raw, mistimed axios call.

  const displayName = auth.user?.displayName;
  // const firstName = displayName.split(' ')[0];
  // console.log("auth.user?.email: ", auth.user?.email)

  const [reviewCreated, setReviewCreated] = useState(false);

  let product =
    Array.isArray(detailProduct) && detailProduct.length
      ? detailProduct[1]
        ? detailProduct[1]
        : detailProduct[0]
      : null;

  /* let product = detailProduct[1] ? detailProduct[1] : detailProduct[0];
  const allData = [{ ...product, email }]; */

  const [form, setForm] = useState({
    emailUser: '',
    ProductId: '',
    rating: 0,
    comment: '',
  });

  // Actualizar form cuando product o email estén disponibles
  useEffect(() => {
    if (product) {
      setForm((prev) => ({
        ...prev,
        emailUser: email || '',
        ProductId: product.id || '',
      }));
    }
  }, [product, email]);

  const [error, setError] = useState({
    email: '',
    ProductId: '',
    rating: 0,
    comment: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getProductByName(name));
        await dispatch(getReviews());
      } catch (error) {
        console.error('ERROR AL OBTENER LA INFO DEL PRODUCTO', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch, name]);

  useEffect(() => {
    if (product) {
      // Verifica si emailUser necesita ser actualizado
      if (form.emailUser !== email) {
        setForm((prevForm) => ({
          ...prevForm,
          emailUser: email,
        }));
      }
    }
  }, [email, form.emailUser, product]);

  useEffect(() => {
    if (product) {
      // Verifica si ProductId necesita ser actualizado
      if (form.ProductId !== (product?.id || '')) {
        setForm((prevForm) => ({
          ...prevForm,
          ProductId: product?.id || '',
        }));
      }
    }
  }, [form.ProductId, product]);

  const hancleAddtoCart = () => {
    const quantityToadd = 1;
    dispatch(addToCart(product, quantityToadd));
  };

  const changeHandler = (event) => {
    //esta funcion actualiza el estado del formulario conel nuevo valor ingresado en los campos inputs
    const property = event.target.name; //inputs
    const value = event.target.value; //valor ingresado
    setForm({ ...form, [property]: value });

    if (property === 'comment') {
      if (value.length > 250) {
        setCommentError('El comentario no debe exceder los 250 caracteres');
      } else {
        setCommentError('');
      }
    }
    //llama a la funcion para validar los campos actualizados en tiempo real
    validate({ ...form, [property]: value }, property);
  };

  const validate = (form) => {
    const patternNombre = /^[A-Za-z\s]+$/;
    const patternNumeros = /^[0-9]+$/;
    const newError = { ...error }; // copia del estado de error existente

    if (!patternNumeros.test(form.rating) || !form.rating) {
      newError.rating = 'Debe ingresar solo Numeros';
    } else {
      newError.rating = '';
    }

    if (!patternNombre.test(form.comment) || !form.comment) {
      newError.comment = 'Ingrese solo letras A-Z';
    } else {
      newError.comment = '';
    }

    setError(newError); // Actualiza el estado de error
  };

  const disable = () => {
    if (ratingError || commentError) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (buys && buys.length > 0 && currentUser?.id) {
      const allMatchProductId = buys.some((buy) => {
        // buy.products is stored as a JSON string on the backend
        // (Buys.products is a TEXT column) — it has to be parsed
        // before reading .items / .statusDetail off of it.
        let purchase;
        try {
          purchase = typeof buy.products === 'string' ? JSON.parse(buy.products) : buy.products;
        } catch {
          return false;
        }
        const items = purchase?.items || [];
        const wasDelivered = !purchase?.statusDetail || purchase.statusDetail === 'accredited';
        return (
          wasDelivered &&
          items.some((item) => item.id === product?.id) &&
          buy.userId === currentUser.id
        );
      });

      // Verifica si el usuario ya ha revisado el producto
      const hasReviewed =
        Array.isArray(review) &&
        review.some((rev) => rev.ProductId === product?.id && rev.userId === currentUser.id);

      setReviewButtonEnabled(allMatchProductId && !hasReviewed);
    } else {
      setReviewButtonEnabled(false);
    }
  }, [buys, currentUser, review, product?.id]);

  /* const handleSubmit = (detailProduct) => {
    const allData = [{ ...product, email }];
    // console.log("allData de handleSubmit: ", allData)
    dispatch(createOrder(allData));
  }; */

  const handleSubmit = () => {
    if (!product) return;
    // array de productos. En este caso sólo uno:
    const items = [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      },
    ];
    // objeto con el email del usuario
    const emailObj = { email: email };

    dispatch(createOrder([items, emailObj]));
  };
  const handleEditButton = () => {
    navigate(`/admin/products/create/${product.name}`);
  };

  const openReviewPopup = () => {
    setReviewPopupOpen(true);
  };

  const closeReviewPopup = () => {
    setReviewPopupOpen(false);
  };

  const handlePuntajeChange = (newPuntaje) => {
    setForm({ ...form, rating: newPuntaje });
    if (newPuntaje < 1 || newPuntaje > 5) {
      setRatingError('El puntaje debe estar entre 1 y 5');
    } else {
      setRatingError('');
    }
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (reviewCreated) return; // guard against double-submit
    try {
      const response = await axios.post('/review/create', form);
      //los datos del formulario los paso en formData (incluido los temperamentos en forma de cadena "hola, perro, paz")
      const newReview = response.data;
      setReviews([...reviews, newReview]);

      setReviewCreated(true);
      alert('Review creada con éxito!!!');
      dispatch(getReviews());
    } catch (error) {
      alert(error.response.data.error);
    }
    closeReviewPopup();
  };

  const calculateAverageRating = () => {
    if (!product) return 0;
    const productReviews = Array.isArray(review)
      ? review.filter((rev) => rev.ProductId === product.id)
      : [];
    // The product's DB rating is a permanent baseline data point, not just
    // a placeholder shown until reviews exist — each new review is folded
    // into the same average instead of overriding it.
    const ratings = [Number(product.rating), ...productReviews.map((rev) => Number(rev.rating))];
    const sum = ratings.reduce((total, r) => total + r, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <div className={styles.conteiner}>
      {loading ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : (
        product && (
          <div>
            <div className={styles.productCont}>
              <div className={styles.imgCont}>
                <img src={product?.image} alt='' />
              </div>
              <div className={`${styles.column} ${styles.infoProduct}`}>
                <div className={styles.stockEdit}>
                  <p>Stock: {product?.stock}</p>
                  {isAdmin && (
                    <button className={styles.editButton} onClick={handleEditButton}>
                      Editar
                    </button>
                  )}
                </div>

                <h1>{product?.name}</h1>
                <p>{product?.description}</p>
                <p className={styles.ratingCard}>Rating: {averageRating} / 5</p>
                <div className={styles.price}>
                  <p>$ {product?.price}</p>
                </div>
                <div className={styles.buyCont}>
                  <button
                    className={styles.btnBuy}
                    onClick={() => handleSubmit(/* detailProduct */)}
                    disabled={!email}
                  >
                    Comprar
                  </button>

                  <button className={styles.btnAddToCart} onClick={hancleAddtoCart}>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.reviewsCont}>
              <div className={styles.contTitulos}>
                <h2 className={styles.tituloReviews}>Product Reviews</h2>
                <button
                  className={styles.añadir}
                  onClick={openReviewPopup}
                  disabled={!isReviewButtonEnabled}
                >
                  Añadir review
                </button>
              </div>
              {isReviewPopupOpen && (
                <div className={styles.modalBackground}>
                  <div className={styles.reviewPopup}>
                    <h2 className={styles.queOpinas}>¿Que opinas sobre este producto?</h2>
                    {displayName && (
                      <p className={styles.saludoReview}>Hola, {displayName.split(' ')[0]}</p>
                    )}
                    <span className={styles.productName}>{name}</span>
                    <div className={styles.imgReviewCont}>
                      <img className={styles.imgReview} src={product?.image} alt='' />
                    </div>
                    <div className={styles.areaNombres}>
                      <h2 className={styles.nombreRev}>Puntaje: </h2>
                      <p className={styles.numeros}>{form.rating} / 5</p>
                      {/* <input disabled={true} className={style.nombreRev} type="text" value={form.nombre} onChange={changeHandler} name="nombre" placeholder={displayName} /> */}
                      <div className={styles.starsCont}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            role='button'
                            tabIndex={0}
                            aria-label={`${star} de 5`}
                            className={`${styles.star} ${form.rating >= star ? styles.starFilled : ''}`}
                            onClick={() => handlePuntajeChange(star)}
                            onKeyDown={(e) =>
                              (e.key === 'Enter' || e.key === ' ') && handlePuntajeChange(star)
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {ratingError && <span className={styles.error}>{ratingError}</span>}
                    </div>
                    <textarea
                      className={styles.escribirRev}
                      type='text'
                      value={form.comment}
                      onChange={changeHandler}
                      name='comment'
                      placeholder='Escribe tu opinión'
                    />
                    {commentError && <span className={styles.error}>{commentError}</span>}
                    <div className={styles.botonesReview}>
                      <button
                        disabled={disable() || reviewCreated}
                        className={styles.enviar}
                        onClick={submitReview}
                        type='submit'
                      >
                        Enviar
                      </button>
                      {/* disabled={disable() || reviewCreated} */}
                      <button className={styles.cancelar} onClick={closeReviewPopup}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.rev2}>
                {Array.isArray(review) &&
                  review.map((review, index) => {
                    if (review.ProductId === product?.id) {
                      const formattedDateTime = new Date(review.createdAt).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      return (
                        <div className={styles.review} key={index}>
                          <div className={styles.nombreFecha}>
                            <p className={styles.user}>{review.user?.name}</p>
                            <p className={styles.fecha}>{formattedDateTime}</p>
                          </div>
                          <p className={styles.comment}>{review.comment}</p>
                          <p className={styles.puntaje}>Puntaje: {review.rating} / 5</p>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
