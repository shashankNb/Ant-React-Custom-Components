import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'antd/dist/reset.css';
import './index.css'
import {HashRouter} from "react-router-dom";
import {ConfigProvider} from './bundles/AntD.tsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import between from 'dayjs/plugin/isBetween';

const theme = {
    token: {
        colorPrimary: '#337ab7', //337ab7
        colorSuccess: '#5cb85c',
        colorWarning: '#f0ad4e',
        colorInfo: '#337ab7', // 5bc0de
        colorError: '#d9534f',
        fontSize: 14,
        fontWeightStrong: 500
    },
    components: {
        Menu: {
            itemBorderRadius: 0,
            itemMarginBlock: 5,
        },
        Layout: {
            headerBg: '#FFF',
        },
    }
};

dayjs.extend(utc);
dayjs.extend(between)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ConfigProvider theme={theme}>
        <HashRouter>
            <App theme={theme}/>
        </HashRouter>
    </ConfigProvider>
)
