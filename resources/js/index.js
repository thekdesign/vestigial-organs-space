import {createApp} from 'vue';
import App from 'components/App.vue';
import 'css/app.css';

createApp(App).mount('#app');

// Vercel Analytics + Speed Insights — 純 client SPA，直接 inject。
// dynamic import 讓本機 / 非 Vercel 環境拉不到時不影響主程式。
if (typeof window !== 'undefined') {
    Promise.all([
        import('@vercel/analytics'),
        import('@vercel/speed-insights'),
    ]).then(([analytics, speed]) => {
        analytics.inject();
        speed.injectSpeedInsights();
    });
}
