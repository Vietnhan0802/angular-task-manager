# Angular Task Manager Dashboard

A modern, feature-rich task management application built with Angular 19 and Tailwind CSS.

![Angular](https://img.shields.io/badge/Angular-19-red?style=for-the-badge&logo=angular)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)

## 🌟 Features

- **Dashboard** - Overview with statistics, completion rate chart, and recent tasks
- **Task Management** - Full CRUD operations for tasks
- **Filtering & Search** - Filter by status, priority, and search by keyword
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Dark Theme** - Modern dark theme with glassmorphism effects

## 🔧 Angular Features Demonstrated

| Feature | Implementation |
|---------|---------------|
| Components | Dashboard, TaskList, TaskForm, TaskDetail, Header, Sidebar |
| Modules | AppModule with declarations, imports |
| Services & DI | TaskService with @Injectable |
| Routing | Routes, Route Guards, Route Parameters |
| Reactive Forms | FormGroup, FormBuilder, Validators, FormArray |
| Template-driven Forms | ngModel two-way binding |
| Custom Pipes | FilterTasksPipe, RelativeTimePipe |
| Custom Directives | PriorityColorDirective, HoverEffectDirective |
| Route Guards | TaskExistsGuard (CanActivate) |
| RxJS | BehaviorSubject, Observable, operators |
| Lifecycle Hooks | OnInit, OnDestroy, OnChanges |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/angular-task-manager.git

# Navigate to project directory
cd angular-task-manager

# Install dependencies
npm install

# Start development server
npm run start
```

Open http://localhost:4200 in your browser.

## 📁 Project Structure

```
src/
├── app/
│   ├── components/        # Shared components
│   │   ├── header/
│   │   └── sidebar/
│   ├── pages/             # Page components
│   │   ├── dashboard/
│   │   ├── task-list/
│   │   ├── task-form/
│   │   └── task-detail/
│   ├── services/          # Business logic
│   ├── models/            # TypeScript interfaces
│   ├── pipes/             # Custom pipes
│   ├── directives/        # Custom directives
│   └── guards/            # Route guards
└── styles.css             # Global styles + Tailwind
```

## 🎨 Design

- **Tailwind CSS** for utility-first styling
- **Dark theme** with custom color palette
- **Glassmorphism** effects
- **Smooth animations** and transitions
- **Responsive layout** for all devices

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Angular and Tailwind CSS
