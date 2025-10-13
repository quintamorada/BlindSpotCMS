# Design Guidelines: Persiana CMS & E-commerce Website

## Design Approach

**Dual Strategy Implementation:**
- **Admin Panel (/admin/*)**: Material Design System - optimized for productivity, data management, and content editing workflows
- **Frontend (E-commerce)**: Reference-based approach inspired by modern home decor e-commerce (Wayfair, Build.com) and Brazilian market leaders

## Color Palette

### Frontend (E-commerce)
**Light Mode:**
- Primary: 220 15% 25% (Deep sophisticated blue-gray)
- Secondary: 35 65% 55% (Warm terracotta/amber for CTAs)
- Neutral: 220 10% 96% (Soft background)
- Text: 220 20% 15%

**Dark Mode:**
- Primary: 220 30% 85%
- Background: 220 15% 12%
- Surface: 220 12% 18%

### Admin Panel
- Primary: 210 100% 50% (Material Blue)
- Success: 142 76% 36%
- Warning: 38 92% 50%
- Error: 0 84% 60%
- Background (Light): 0 0% 98%
- Background (Dark): 220 15% 10%

## Typography

**Frontend:**
- Headings: Playfair Display (serif, elegant) - 700 weight
- Body: Inter (sans-serif) - 400, 500, 600 weights
- Accent: Montserrat for CTAs - 600 weight

**Admin Panel:**
- All text: Inter - 400, 500, 600, 700 weights (consistency and readability)

## Layout System

**Spacing Units**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 (p-2, m-4, gap-6, etc.)

**Frontend Layout:**
- Max container: max-w-7xl
- Grid system: 12-column for product listings (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
- Section spacing: py-16 md:py-24

**Admin Layout:**
- Sidebar navigation: w-64 fixed left
- Main content: ml-64 with max-w-7xl
- Forms: max-w-4xl centered

## Component Library

### Frontend Components

**Navigation:**
- Sticky header with logo, main nav, search bar, shopping cart icon
- Mobile: Hamburger menu with slide-out drawer
- Mega menu for product categories with images

**Hero Section:**
- Full-width immersive image showcase (h-[600px])
- Overlay gradient (from-black/60 to-transparent)
- Centered headline + subtext + dual CTAs
- Subtle parallax scroll effect

**Product Cards:**
- Aspect ratio 4:3 image
- Hover: subtle zoom on image (scale-105), shadow elevation
- Product name, starting price, "Ver detalhes" link
- Quick view overlay option

**Product Detail Page:**
- Left: Image gallery with main image + thumbnail strip
- Right: Product info, price, specs table, quantity selector, add to cart
- Tabs below: Descrição, Especificações, Instalação

**CTA Sections:**
- Split layout: 50% image, 50% content
- Background: subtle texture or product lifestyle image
- Rounded-2xl containers with p-12 padding

**Footer:**
- 4-column grid: Sobre Nós, Produtos, Atendimento, Redes Sociais
- Newsletter signup with inline form
- Trust badges (Secure checkout, 5-year warranty, Free installation quote)

### Admin Panel Components

**Dashboard Cards:**
- Statistical cards: grid-cols-1 md:grid-cols-4
- Icons from Material Icons
- Chart integration area for sales analytics

**Data Tables:**
- Striped rows (even:bg-gray-50)
- Sortable column headers with arrow indicators
- Action buttons: icon-only (edit, delete, view)
- Pagination at bottom
- Search/filter bar above table

**Forms:**
- Floating labels for inputs
- Rich text editor (Tiptap) for content
- Image upload: Drag-drop zone with preview grid
- Multi-select dropdowns for categories
- Toggle switches for published/draft status

**Sidebar Navigation:**
- Grouped menu items with icons
- Active state: left border (border-l-4) + background highlight
- Collapsible sections for sub-menus

## Images

**Frontend:**
1. **Hero Image**: Luxurious living room with elegant blinds filtering natural light - full-width, high-quality lifestyle photography
2. **Category Images**: Close-up shots of each blind type (blackout, roller, vertical, horizontal)
3. **Product Images**: Multiple angles of each product on white background + lifestyle context shots
4. **Trust Section**: Professional installation team photo
5. **Footer Background**: Subtle texture or pattern related to fabric/materials

**Admin Panel:**
- Placeholder images only for empty states
- Real product images in management tables

## Animations

**Frontend (Minimal, purposeful):**
- Product card hover: transform scale-105 duration-300
- Hero CTA buttons: subtle pulse on primary CTA
- Smooth scroll reveal: fade-in-up for sections (intersection observer)

**Admin Panel:**
- None except standard Material Design state changes
- Loading spinners for async operations

## Special Considerations

**E-commerce Frontend:**
- Prominent WhatsApp contact button (fixed bottom-right)
- Trust indicators throughout (free shipping threshold, secure payment badges)
- Product comparison tool (checkbox on cards, compare page)
- Breadcrumb navigation on all interior pages
- Mobile-first responsive design with touch-friendly targets (min 44px)

**Admin Workflow:**
- Bulk actions for product management
- Quick edit mode for inline updates
- Preview button to see changes on frontend before publishing
- Auto-save drafts every 30 seconds
- Image optimization suggestions (file size, dimensions)

**Accessibility:**
- WCAG AA contrast ratios throughout
- Keyboard navigation for all interactive elements
- Screen reader labels on icon-only buttons
- Focus indicators: ring-2 ring-primary with ring-offset-2

This dual-design approach ensures the admin panel maximizes productivity while the frontend creates an engaging, conversion-optimized shopping experience for premium window blinds.