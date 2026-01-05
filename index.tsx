
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Rendering error:", error);
    rootElement.innerHTML = `<div style="padding: 20px; color: #666; font-family: sans-serif;">
      <h2>应用启动失败</h2>
      <p>请检查控制台以获取详细错误信息。</p>
    </div>`;
  }
}
