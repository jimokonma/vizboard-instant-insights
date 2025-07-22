# VizBoard Instant Insights

A modern, interactive data visualization dashboard built with React, TypeScript, and Vite. Transform your data into beautiful charts and gain instant insights with an intuitive drag-and-drop interface.

![VizBoard Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.0+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Vite](https://img.shields.io/badge/Vite-5.0+-purple)

## ✨ Features

### 📊 Chart Types
- **Bar Charts** - Perfect for comparing categories
- **Line Charts** - Ideal for time series and trends
- **Pie Charts** - Great for showing proportions
- **Area Charts** - Excellent for cumulative data visualization

### 🎛️ Interactive Configuration
- **Dynamic Chart Selection** - Switch between chart types instantly
- **Flexible Axis Configuration** - Choose any field for X and Y axes
- **Multi-Series Support** - Plot multiple data series simultaneously
- **Real-time Updates** - See changes as you configure

### 📋 Data Management
- **CSV File Upload** - Drag and drop your data files
- **Data Preview** - View your data in a clean table format
- **Field Selection** - Choose which fields to visualize
- **Data Filtering** - Apply filters to focus on specific data

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop and mobile devices
- **Dark/Light Theme** - Choose your preferred appearance
- **Intuitive Interface** - Easy-to-use controls and layouts
- **Professional Styling** - Built with shadcn/ui components

### 📥 Export Capabilities
- **Chart Downloads** - Export visualizations as images
- **Data Exports** - Download filtered data as CSV
- **Bulk Downloads** - Export multiple charts at once

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vizboard-instant-insights
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8081`

## 📖 Usage Guide

### 1. Upload Your Data
- Click the file upload area or drag and drop your CSV file
- Supported formats: CSV, TSV
- The system will automatically parse and display your data

### 2. Configure Your Chart
- **Select Chart Type**: Choose from Bar, Line, Pie, or Area charts
- **Set X-Axis**: Choose which field to display on the horizontal axis
- **Add Y-Axis Fields**: Select one or more fields to plot on the vertical axis
- **Apply Filters**: Use the filter panel to focus on specific data subsets

### 3. Visualize and Export
- Your chart updates in real-time as you configure
- Use the download button to export your visualization
- Export filtered data using the data preview panel

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Custom chart components
- **Data Processing**: Custom CSV parser and data filters

## 📁 Project Structure

```
vizboard-instant-insights/
├── src/
│   ├── components/          # React components
│   │   ├── chart/          # Chart-related components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...             # Other components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎯 Key Components

- **Dashboard**: Main application layout and state management
- **ChartSelector**: Chart type and configuration controls
- **SimpleChart**: Chart rendering component
- **DataPreview**: Tabular data display
- **FileUpload**: CSV file upload and parsing
- **FilterPanel**: Data filtering interface

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🚀 Roadmap

- [ ] Additional chart types (Scatter, Heatmap, etc.)
- [ ] Advanced filtering options
- [ ] Data transformation tools
- [ ] Collaboration features
- [ ] Cloud storage integration
- [ ] Real-time data streaming

---

**Built with ❤️ using React, TypeScript, and Vite**
