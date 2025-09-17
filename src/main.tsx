import { createRoot } from 'react-dom/client';
import RouterList from './components/RouterList';
import '@ant-design/v5-patch-for-react-19';
import './styles/global.css';

const app = createRoot(document.getElementById('root')!);
app.render(<RouterList />);
