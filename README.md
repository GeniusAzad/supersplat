# 3D Gaussian Splats Marketplace

A comprehensive marketplace for buying and selling 3D Gaussian Splats built with React, TypeScript, and Supabase.

## 🚀 Features

### For Buyers
- **Browse & Search**: Discover thousands of high-quality 3D Gaussian Splats
- **Advanced Filtering**: Filter by category, price range, ratings, and more
- **Detailed Previews**: View splats with thumbnails and detailed information
- **Reviews & Ratings**: Read reviews from other buyers
- **Secure Downloads**: Instant access to purchased content

### For Sellers
- **Easy Upload**: Drag & drop interface for .ply and .splat files
- **Seller Dashboard**: Track earnings, downloads, and performance
- **Automated Thumbnails**: AI-generated previews for your splats
- **Flexible Pricing**: Set your own prices and manage listings
- **Analytics**: Detailed insights into your sales performance

### Platform Features
- **User Authentication**: Secure sign up/sign in with Supabase Auth
- **File Storage**: Reliable cloud storage for 3D files and thumbnails
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gaussian-splats-marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```
   - Fill in your Supabase credentials

4. **Run database migrations**
   - In your Supabase dashboard, go to SQL Editor
   - Run the migration script from `supabase/migrations/create_marketplace_schema.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄 Database Schema

### Tables
- **profiles**: User profiles and seller information
- **splats**: 3D Gaussian Splat listings
- **reviews**: User reviews and ratings
- **purchases**: Purchase history and transactions

### Storage Buckets
- **splats**: Stores .ply and .splat files
- **thumbnails**: Stores generated thumbnail images

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Authenticated users can only modify their own data
- Public read access for browsing content
- Secure file upload with proper validation

## 🎨 UI Components

### Reusable Components
- **Button**: Multiple variants and sizes
- **Input**: Form inputs with validation
- **Modal**: Accessible modal dialogs
- **LoadingSpinner**: Loading states
- **SplatCard**: Product display cards
- **SplatGrid**: Responsive grid layout

### Layout Components
- **Header**: Navigation and authentication
- **Footer**: Site links and information
- **FilterSidebar**: Advanced filtering options

## 📱 Pages

- **HomePage**: Landing page with featured content
- **BrowsePage**: Browse and search all splats
- **SplatDetailPage**: Detailed product view
- **SellPage**: Upload and list new splats
- **DashboardPage**: Seller analytics and management

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Tailwind Configuration
Custom theme with:
- Primary color palette
- Custom animations
- Utility classes for common patterns

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Vercel
1. Import project to Vercel
2. Configure environment variables
3. Deploy with automatic builds

## 🔮 Future Enhancements

- **Payment Integration**: Stripe/PayPal for secure transactions
- **3D Preview**: WebGL viewer for splat files
- **Advanced Analytics**: Detailed seller insights
- **Social Features**: Follow sellers, wishlists
- **Mobile App**: React Native companion app
- **AI Features**: Auto-tagging, content recommendations
- **Bulk Operations**: Upload multiple files at once
- **Version Control**: Track splat updates and versions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: Check the README and code comments
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord server for help and discussions

---

Built with ❤️ for the 3D community