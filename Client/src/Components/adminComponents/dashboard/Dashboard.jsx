import './dashboard.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAllBuys } from '../../../redux/actions/action';
import { getUsers } from '../../../redux/actions/action';
import Loader from '../../loader/loader';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, Tooltip, Legend);

const STATUS_LABELS = {
  approved: 'Aprobados',
  pending: 'Pendientes',
  in_process: 'En proceso',
  rejected: 'Rechazados',
  failure: 'Fallidos',
};
const STATUS_COLORS = {
  approved: '#28a745',
  pending: '#ffc107',
  in_process: '#ffc107',
  rejected: '#dc3545',
  failure: '#dc3545',
};
const FALLBACK_COLOR = '#6c757d';

const formatCurrency = (n) =>
  `$${Number(n).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Card({ title, value, value2, text1, text2 }) {
  return (
    <div className='card'>
      <p className='title'>{title}</p>
      <div className='flex-container'>
        <p className='value'>{value}</p>
        {value2 !== undefined && <p className='value'>{value2}</p>}
      </div>
      <div className='cont-text'>
        <p className='text1'>{text1}</p>
        <p className='text2'>{text2}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, text, chartData }) {
  return (
    <div className='chart-card'>
      <p className='chart-title'>{title}</p>
      <p className='chart-text'>{text}</p>
      <div className='chart'>
        <Doughnut data={chartData} />
      </div>
    </div>
  );
}

function TopProductsCard({ products }) {
  return (
    <div className='chart-card'>
      <p className='chart-title'>Productos más vendidos</p>
      <p className='chart-text'>Ranking por unidades vendidas (pedidos aprobados)</p>
      {products.length === 0 ? (
        <p className='text1'>Todavía no hay ventas aprobadas.</p>
      ) : (
        <ol className='top-products-list'>
          {products.map((p, i) => (
            <li key={p.id || p.title} className='top-products-item'>
              <span className='top-products-rank'>{i + 1}</span>
              {p.picture && <img src={p.picture} alt={p.title} className='top-products-img' />}
              <div className='top-products-info'>
                <span className='top-products-title'>{p.title}</span>
                <span className='top-products-meta'>
                  {p.quantity} unidades &middot; {formatCurrency(p.revenue)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Dashboard() {
  const dispatch = useDispatch();
  const [buys, setBuys] = useState(null); // null = still loading
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [buysData, usersData] = await Promise.all([
        dispatch(getAllBuys()),
        dispatch(getUsers()),
      ]);
      setBuys(Array.isArray(buysData) ? buysData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    };
    fetchData();
  }, [dispatch]);

  if (buys === null || users === null) {
    return <Loader />;
  }

  const approvedBuys = buys.filter((b) => b.status === 'approved');

  let totalRevenue = 0;
  let totalUnits = 0;
  const productTotals = {};

  approvedBuys.forEach((buy) => {
    const items = buy.products?.items || [];
    items.forEach((item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;
      totalRevenue += quantity * unitPrice;
      totalUnits += quantity;

      const key = item.id || item.title;
      if (!productTotals[key]) {
        productTotals[key] = {
          id: item.id,
          title: item.title,
          picture: item.picture_url,
          quantity: 0,
          revenue: 0,
        };
      }
      productTotals[key].quantity += quantity;
      productTotals[key].revenue += quantity * unitPrice;
    });
  });

  const orderCount = approvedBuys.length;
  const averageOrderValue = orderCount ? totalRevenue / orderCount : 0;
  const uniqueCustomers = new Set(approvedBuys.map((b) => b.userId).filter(Boolean)).size;

  const buyerUserIds = new Set(approvedBuys.map((b) => b.userId).filter(Boolean));
  const activeUsers = users.filter((u) => u.userState).length;
  const disabledUsers = users.length - activeUsers;
  const conversionCount = users.filter((u) => buyerUserIds.has(u.id)).length;
  const conversionRate = users.length ? ((conversionCount / users.length) * 100).toFixed(1) : 0;

  const now = new Date();
  const usersThisMonth = users.filter((u) => {
    const created = new Date(u.createdAt);
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  const userStatusChartData = {
    labels: ['Activos', 'Deshabilitados'],
    datasets: [{ data: [activeUsers, disabledUsers], backgroundColor: ['#28a745', '#dc3545'] }],
  };

  const conversionChartData = {
    labels: ['Compraron al menos 1 vez', 'Nunca compraron'],
    datasets: [
      {
        data: [conversionCount, users.length - conversionCount],
        backgroundColor: ['#007bff', '#333'],
      },
    ],
  };

  const topProducts = Object.values(productTotals)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const statusCounts = buys.reduce((acc, b) => {
    const status = b.status || 'desconocido';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  const statusKeys = Object.keys(statusCounts);

  const orderStatusChartData = {
    labels: statusKeys.map((s) => STATUS_LABELS[s] || s),
    datasets: [
      {
        data: statusKeys.map((s) => statusCounts[s]),
        backgroundColor: statusKeys.map((s) => STATUS_COLORS[s] || FALLBACK_COLOR),
      },
    ],
  };

  return (
    <div className='general-content'>
      <div className='content'>
        <Card
          title='Ventas totales (aprobadas)'
          value={formatCurrency(totalRevenue)}
          value2={orderCount}
          text1={`Unidades vendidas: ${totalUnits}`}
          text2={`Pedidos aprobados: ${orderCount}`}
        />
        <Card
          title='Ticket promedio'
          value={formatCurrency(averageOrderValue)}
          text1='Por pedido aprobado'
          text2={`Clientes únicos: ${uniqueCustomers}`}
        />
        <Card
          title='Pedidos totales'
          value={buys.length}
          text1={`Aprobados: ${statusCounts.approved || 0}`}
          text2={`Otros estados: ${buys.length - (statusCounts.approved || 0)}`}
        />
        <Card
          title='Usuarios registrados'
          value={users.length}
          text1={`Nuevos este mes: ${usersThisMonth}`}
          text2={`Tasa de conversión: ${conversionRate}%`}
        />
      </div>
      {/* CHARTS SECTION */}
      <div className='content-charts'>
        <ChartCard
          title='Estado de los pedidos'
          text='Distribución de todos los pedidos registrados'
          chartData={orderStatusChartData}
        />
        <TopProductsCard products={topProducts} />
        <ChartCard
          title='Estado de usuarios'
          text='Activos vs. deshabilitados'
          chartData={userStatusChartData}
        />
        <ChartCard
          title='Conversión de usuarios'
          text={`${conversionRate}% de tus usuarios registrados compró al menos una vez`}
          chartData={conversionChartData}
        />
      </div>
    </div>
  );
}

export default Dashboard;

Card.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  text1: PropTypes.string,
  text2: PropTypes.string,
};

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  chartData: PropTypes.object.isRequired,
};

TopProductsCard.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      picture: PropTypes.string,
      quantity: PropTypes.number,
      revenue: PropTypes.number,
    }),
  ).isRequired,
};
