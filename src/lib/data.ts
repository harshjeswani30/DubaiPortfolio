export interface Project {
  id: string
  title: string
  slug: string
  description: string
  content?: string
  tech_stack: string[]
  category: string
  tagline?: string
  tagline_highlight?: string
  featured_image?: string
  images?: string[]
  live_url?: string
  github_url?: string
  is_featured: boolean
  is_published: boolean
  display_order: number
  duration?: string
  client?: string
  role?: string
  challenges?: string[]
  solutions?: string[]
  results?: string[]
  testimonial?: {
    quote: string
    author: string
    position: string
  }
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  category: string
  tags: string[]
  reading_time: number
  published_at: string
  is_published: boolean
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Luxury Real Estate Portal",
    slug: "luxury-real-estate",
    description: "A premium property listing platform for high-end real estate in Dubai with immersive 3D views.",
    content: "This project involved creating a sophisticated real estate platform tailored for Dubai's luxury property market. The platform features immersive 3D virtual tours, advanced property filtering, and a seamless user experience designed to showcase high-end properties.\n\nThe application leverages Three.js for stunning 3D visualizations, allowing potential buyers to explore properties virtually before scheduling in-person visits. The backend is built with PostgreSQL for robust data management and fast query performance.",
    tech_stack: ["Next.js", "PostgreSQL", "Three.js", "Tailwind CSS"],
    category: "Web Development",
    tagline: "Perfect for luxury",
    tagline_highlight: "living",
    featured_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop"
    ],
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 1,
    duration: "4 months",
    client: "Dubai Properties Group",
    role: "Lead Developer",
    challenges: [
      "Implementing smooth 3D property tours that work across all devices",
      "Handling large image galleries with optimal loading performance",
      "Creating an intuitive filtering system for complex property attributes",
      "Ensuring fast search results with millions of property listings"
    ],
    solutions: [
      "Used Three.js with progressive loading and LOD (Level of Detail) techniques",
      "Implemented lazy loading with blur placeholders and CDN optimization",
      "Built a faceted search system with real-time filtering using PostgreSQL",
      "Created database indexes and implemented Redis caching for search queries"
    ],
    results: [
      "40% increase in user engagement compared to previous platform",
      "Average session duration increased from 2 to 8 minutes",
      "Property inquiries increased by 65%",
      "Page load time reduced to under 2 seconds"
    ],
    testimonial: {
      quote: "The new platform has transformed how we showcase our properties. The 3D tours have been a game-changer for our international clients.",
      author: "Ahmed Al Maktoum",
      position: "CEO, Dubai Properties Group"
    }
  },
  {
    id: "2",
    title: "FinTech Investment Dashboard",
    slug: "fintech-dashboard",
    description: "Real-time portfolio tracking and investment analytics for modern traders and crypto enthusiasts.",
    content: "A comprehensive investment dashboard that provides real-time portfolio tracking, market analytics, and trading insights. The platform supports both traditional stocks and cryptocurrency assets, offering unified portfolio management.\n\nThe dashboard features advanced charting with D3.js, real-time price updates via WebSocket connections, and AI-powered trading signals to help users make informed decisions.",
    tech_stack: ["React", "D3.js", "Node.js", "Redis"],
    category: "FinTech",
    tagline: "Built for modern",
    tagline_highlight: "traders",
    featured_image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&h=800&fit=crop"
    ],
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 2,
    duration: "6 months",
    client: "CryptoVest Capital",
    role: "Full Stack Developer",
    challenges: [
      "Processing and displaying real-time data from multiple exchanges",
      "Building responsive charts that handle millions of data points",
      "Implementing secure authentication for financial data",
      "Managing complex state across multiple trading pairs"
    ],
    solutions: [
      "Built a WebSocket aggregation layer with Redis pub/sub for real-time updates",
      "Implemented D3.js with canvas rendering and data decimation for performance",
      "Used JWT with refresh tokens and 2FA for enhanced security",
      "Leveraged Redux Toolkit with normalized state for efficient updates"
    ],
    results: [
      "Supporting 50,000+ concurrent users with real-time updates",
      "Chart rendering performance improved by 300%",
      "Zero security incidents since launch",
      "User retention rate of 85%"
    ],
    testimonial: {
      quote: "This dashboard gives us the edge we need in the fast-paced crypto market. The real-time analytics are incredibly accurate.",
      author: "Sarah Chen",
      position: "Head of Trading, CryptoVest Capital"
    }
  },
  {
    id: "3",
    title: "Smart City IoT Platform",
    slug: "smart-city-iot",
    description: "Centralized monitoring and management for urban infrastructure and IoT sensors in smart cities.",
    content: "An enterprise-grade IoT platform designed to manage thousands of sensors across urban infrastructure. The system monitors traffic flow, air quality, energy consumption, and public safety in real-time.\n\nBuilt with scalability in mind, the platform uses TimescaleDB for time-series data and MQTT for efficient device communication. The dashboard provides city administrators with actionable insights and automated alerting.",
    tech_stack: ["Python", "FastAPI", "MQTT", "TimescaleDB"],
    category: "IoT / AI",
    tagline: "Powering smart",
    tagline_highlight: "cities",
    featured_image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=800&fit=crop"
    ],
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: true,
    is_published: true,
    display_order: 3,
    duration: "8 months",
    client: "Dubai Municipality",
    role: "Technical Lead",
    challenges: [
      "Managing data from 10,000+ IoT sensors simultaneously",
      "Ensuring 99.99% uptime for critical city infrastructure",
      "Processing and analyzing terabytes of time-series data",
      "Building a user-friendly interface for non-technical city staff"
    ],
    solutions: [
      "Implemented MQTT broker clustering with automatic failover",
      "Deployed on Kubernetes with multi-region redundancy",
      "Used TimescaleDB with automated data compression and retention policies",
      "Created intuitive dashboards with drag-and-drop customization"
    ],
    results: [
      "20% reduction in city energy consumption",
      "Traffic congestion reduced by 35% through smart signal optimization",
      "Emergency response times improved by 45%",
      "Platform handling 1M+ data points per minute"
    ],
    testimonial: {
      quote: "This platform has revolutionized how we manage our city's infrastructure. The insights we get are invaluable for planning and operations.",
      author: "Dr. Mohammed Al Rashid",
      position: "Director of Smart City Initiative"
    }
  },
  {
    id: "4",
    title: "AI Healthcare Diagnostics",
    slug: "ai-healthcare",
    description: "Predictive diagnostic tools for medical professionals using advanced machine learning models.",
    content: "A cutting-edge healthcare platform that leverages AI to assist medical professionals in diagnosing conditions faster and more accurately. The system analyzes medical images, patient history, and lab results to provide diagnostic recommendations.\n\nThe platform integrates with hospital systems via HL7 FHIR standards and provides explainable AI results, helping doctors understand the reasoning behind each recommendation.",
    tech_stack: ["Python", "PyTorch", "Next.js", "MongoDB"],
    category: "Healthcare",
    tagline: "Transforming patient",
    tagline_highlight: "care",
    featured_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1200&h=800&fit=crop"
    ],
    live_url: "https://example.com",
    github_url: "https://github.com",
    is_featured: false,
    is_published: true,
    display_order: 4,
    duration: "12 months",
    client: "Emirates Health Services",
    role: "ML Engineer & Full Stack Developer",
    challenges: [
      "Training accurate models with limited labeled medical data",
      "Meeting strict healthcare compliance requirements (HIPAA, DHA)",
      "Integrating with legacy hospital information systems",
      "Providing explainable AI results for medical professionals"
    ],
    solutions: [
      "Used transfer learning and synthetic data augmentation techniques",
      "Implemented end-to-end encryption and audit logging for compliance",
      "Built a flexible adapter layer supporting multiple HL7 FHIR versions",
      "Integrated SHAP and LIME for model interpretability"
    ],
    results: [
      "Diagnostic accuracy of 94% for supported conditions",
      "Average diagnosis time reduced by 60%",
      "Successfully deployed in 15 hospitals across UAE",
      "Processing 10,000+ diagnostic requests daily"
    ],
    testimonial: {
      quote: "The AI diagnostic tool has become an essential part of our workflow. It helps us catch conditions we might have missed and confirms our diagnoses.",
      author: "Dr. Fatima Hassan",
      position: "Chief Medical Officer, Emirates Health Services"
    }
  },
]

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Web Development in 2026",
    slug: "future-web-development-2026",
    excerpt: "Exploring the latest trends, from AI-driven development to the evolution of serverless architectures.",
    content: `# The Future of Web Development in 2026

The web development landscape is evolving at an unprecedented pace. As we step into 2026, several groundbreaking trends are reshaping how we build and deploy applications.

## AI-Powered Development

Artificial intelligence has become an integral part of the development workflow. From intelligent code completion to automated testing, AI tools are boosting developer productivity by 40% on average.

### Key AI Tools Transforming Development

- **GitHub Copilot X**: Advanced code generation with context-aware suggestions
- **AI-Driven Testing**: Automated test case generation and bug detection
- **Design-to-Code**: Converting Figma designs directly into production-ready code

## The Rise of Edge Computing

Edge computing has moved from buzzword to mainstream adoption. With frameworks like Next.js and Cloudflare Workers, developers can now deploy code that runs closer to users than ever before.

> "The edge is not just about speed—it's about creating experiences that feel instant." - Industry Expert

## Serverless Architecture Evolution

Serverless has matured significantly, with improved cold start times and better tooling for debugging and monitoring.

### Benefits of Modern Serverless

1. **Cost Efficiency**: Pay only for what you use
2. **Scalability**: Automatic scaling without configuration
3. **Focus on Code**: No infrastructure management required

## What's Next?

The future holds even more exciting possibilities:

- WebAssembly becoming mainstream for performance-critical applications
- Improved developer experience with AI assistants
- Better tooling for building accessible applications

Stay tuned for more updates on the evolving web development landscape!`,
    featured_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop",
    category: "Technology",
    tags: ["Web Dev", "AI", "Future"],
    reading_time: 5,
    published_at: "2026-01-15T10:00:00Z",
    is_published: true,
  },
  {
    id: "2",
    title: "Mastering React Server Components",
    slug: "mastering-react-server-components",
    excerpt: "A comprehensive guide to building high-performance Next.js applications with RSC.",
    content: `# Mastering React Server Components

React Server Components (RSC) represent a paradigm shift in how we build React applications. Let's dive deep into this powerful feature.

## What Are Server Components?

Server Components are React components that render exclusively on the server. They allow you to build applications that span the server and client, combining the interactivity of client-side apps with the performance of server rendering.

## Key Benefits

### 1. Reduced Bundle Size

Server Components don't send JavaScript to the client, significantly reducing your bundle size.

\`\`\`javascript
// This component runs only on the server
async function BlogPosts() {
  const posts = await db.posts.findMany();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

### 2. Direct Database Access

Access your database directly without building API endpoints:

\`\`\`javascript
async function UserProfile({ userId }) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  return <Profile data={user} />;
}
\`\`\`

### 3. Automatic Code Splitting

Next.js automatically splits your code at component boundaries, ensuring optimal loading performance.

## Best Practices

1. **Keep Client Components Small**: Only add "use client" when necessary
2. **Lift State Up**: Move state to the lowest common ancestor
3. **Use Suspense**: Wrap async components with Suspense for better UX
4. **Optimize Data Fetching**: Fetch data in parallel when possible

## Common Patterns

### Composition Pattern

\`\`\`javascript
// Server Component
export default async function Page() {
  const data = await fetchData();
  
  return (
    <div>
      <ServerContent data={data} />
      <ClientInteractive />
    </div>
  );
}
\`\`\`

## Conclusion

React Server Components are transforming how we build web applications. By understanding and applying these concepts, you can build faster, more efficient applications.

Happy coding!`,
    featured_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop",
    category: "Tutorial",
    tags: ["React", "Next.js", "Performance"],
    reading_time: 8,
    published_at: "2026-01-10T14:30:00Z",
    is_published: true,
  },
  {
    id: "3",
    title: "Building Scalable APIs with Node.js",
    slug: "building-scalable-apis-nodejs",
    excerpt: "Learn how to design and implement production-ready REST APIs that can handle millions of requests.",
    content: `# Building Scalable APIs with Node.js

Creating APIs that can scale is crucial for modern applications. In this guide, we'll explore best practices for building robust Node.js APIs.

## Architecture Fundamentals

### Layered Architecture

A well-structured API follows a layered architecture:

- **Routes Layer**: Handle HTTP requests
- **Controller Layer**: Business logic coordination
- **Service Layer**: Core business logic
- **Data Access Layer**: Database operations

## Essential Patterns

### 1. Rate Limiting

Protect your API from abuse:

\`\`\`javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});

app.use('/api/', limiter);
\`\`\`

### 2. Caching Strategies

Implement Redis caching for frequently accessed data:

\`\`\`javascript
async function getCachedUser(userId) {
  const cached = await redis.get(\`user:\${userId}\`);
  if (cached) return JSON.parse(cached);
  
  const user = await db.users.findById(userId);
  await redis.setex(\`user:\${userId}\`, 3600, JSON.stringify(user));
  return user;
}
\`\`\`

### 3. Error Handling

Centralized error handling middleware:

\`\`\`javascript
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      code: err.code
    }
  });
});
\`\`\`

## Performance Optimization

1. **Use Compression**: Gzip responses to reduce payload size
2. **Database Indexing**: Index frequently queried fields
3. **Connection Pooling**: Reuse database connections
4. **Async Operations**: Leverage async/await for non-blocking I/O

## Monitoring & Observability

- Implement health check endpoints
- Use structured logging
- Set up APM tools for performance monitoring
- Create dashboards for key metrics

## Conclusion

Building scalable APIs requires careful planning and implementation of proven patterns. Start with a solid foundation and iterate based on real-world performance data.`,
    featured_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=800&fit=crop",
    category: "Backend",
    tags: ["Node.js", "API", "Backend", "Scalability"],
    reading_time: 7,
    published_at: "2026-01-05T09:00:00Z",
    is_published: true,
  },
]

export async function getProjects() {
  return projects.filter(p => p.is_published).sort((a, b) => a.display_order - b.display_order)
}

export async function getFeaturedProjects() {
  return projects.filter(p => p.is_published && p.is_featured).sort((a, b) => a.display_order - b.display_order).slice(0, 3)
}

export async function getProjectBySlug(slug: string) {
  return projects.find(p => p.slug === slug && p.is_published) || null
}

export async function getBlogPosts() {
  return blogPosts.filter(p => p.is_published).sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
}

export async function getBlogPostBySlug(slug: string) {
  return blogPosts.find(p => p.slug === slug && p.is_published) || null
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  icon_name?: string
  color?: string
  display_order: number
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  start_date: string
  end_date?: string
  description: string
  display_order: number
}

export const skills: Skill[] = [
  { id: "1", name: "React", category: "Frontend", proficiency: 95, color: "#61DAFB", display_order: 1 },
  { id: "2", name: "Next.js", category: "Frontend", proficiency: 95, color: "#ffffff", display_order: 2 },
  { id: "3", name: "TypeScript", category: "Languages", proficiency: 90, color: "#3178C6", display_order: 3 },
  { id: "4", name: "JavaScript", category: "Languages", proficiency: 95, color: "#F7DF1E", display_order: 4 },
  { id: "5", name: "Node.js", category: "Backend", proficiency: 88, color: "#339933", display_order: 5 },
  { id: "6", name: "Python", category: "Languages", proficiency: 85, color: "#3776AB", display_order: 6 },
  { id: "7", name: "Tailwind CSS", category: "Frontend", proficiency: 95, color: "#06B6D4", display_order: 7 },
  { id: "8", name: "PostgreSQL", category: "Database", proficiency: 85, color: "#4169E1", display_order: 8 },
  { id: "9", name: "MongoDB", category: "Database", proficiency: 80, color: "#47A248", display_order: 9 },
  { id: "10", name: "GraphQL", category: "Backend", proficiency: 82, color: "#E10098", display_order: 10 },
  { id: "11", name: "Docker", category: "DevOps", proficiency: 78, color: "#2496ED", display_order: 11 },
  { id: "12", name: "AWS", category: "DevOps", proficiency: 75, color: "#FF9900", display_order: 12 },
  { id: "13", name: "Three.js", category: "Frontend", proficiency: 80, color: "#000000", display_order: 13 },
  { id: "14", name: "GSAP", category: "Frontend", proficiency: 85, color: "#88CE02", display_order: 14 },
  { id: "15", name: "Redis", category: "Database", proficiency: 75, color: "#DC382D", display_order: 15 },
  { id: "16", name: "Git", category: "DevOps", proficiency: 92, color: "#F05032", display_order: 16 },
  { id: "17", name: "Figma", category: "Design", proficiency: 85, color: "#F24E1E", display_order: 17 },
  { id: "18", name: "Framer Motion", category: "Frontend", proficiency: 88, color: "#0055FF", display_order: 18 },
]

export const experiences: Experience[] = [
  {
    id: "1",
    company: "Dubai Tech Solutions",
    position: "Senior Frontend Developer",
    location: "Dubai, UAE",
    start_date: "2023-01-01",
    description: "Leading the development of modern web applications using Next.js and React.",
    display_order: 1,
  },
  {
    id: "2",
    company: "Innovative Startups",
    position: "Full Stack Developer",
    location: "Remote",
    start_date: "2021-06-01",
    end_date: "2022-12-31",
    description: "Built scalable APIs and interactive user interfaces for various clients.",
    display_order: 2,
  },
]

export const aboutContent = {
  name: "Dubai Developer",
  role: "Full Stack Developer & UI/UX Enthusiast",
  bio: "Passionate developer based in Dubai, creating high-performance web applications with a focus on user experience and modern technologies.",
  email: "hello@dubaideveloper.com",
  location: "Dubai, UAE",
}

export async function getSkills() {
  return skills.sort((a, b) => a.display_order - b.display_order)
}

export async function getExperience() {
  return experiences.sort((a, b) => a.display_order - b.display_order)
}

export async function getAboutData() {
  return {
    about: aboutContent,
    experiences: await getExperience(),
    skills: await getSkills(),
  }
}
