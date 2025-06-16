// 戰鬥隊伍組建計算機 - 測試版本
function TeamCalculator() {
  const [message, setMessage] = React.useState("載入成功！");
  
  return React.createElement('div', {
    className: "max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen"
  },
    React.createElement('h1', {
      className: "text-3xl font-bold text-center mb-8 text-gray-800"
    }, "戰鬥隊伍組建計算機"),
    
    React.createElement('div', {
      className: "bg-white rounded-lg shadow-md p-6 text-center"
    },
      React.createElement('p', {
        className: "text-green-600 text-xl font-medium"
      }, message),
      
      React.createElement('p', {
        className: "text-gray-600 mt-4"
      }, "app.js 載入成功！接下來可以替換為完整版本。"),
      
      React.createElement('button', {
        className: "bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600",
        onClick: () => setMessage("按鈕功能正常！")
      }, "測試按鈕")
    )
  );
}

// 渲染應用到頁面
if (typeof ReactDOM !== 'undefined' && document.getElementById('root')) {
  ReactDOM.render(React.createElement(TeamCalculator), document.getElementById('root'));
} else {
  console.error('ReactDOM 或 root 元素未找到');
}
