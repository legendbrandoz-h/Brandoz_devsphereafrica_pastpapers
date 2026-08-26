export interface SEUnit {
  code: string;
  title: string;
  semesterCode: '1.1' | '1.2' | '2.1' | '2.2' | '3.1' | '3.2' | '4.1' | '4.2';
  year: 'Year 1' | 'Year 2' | 'Year 3' | 'Year 4';
  semester: 'Semester 1' | 'Semester 2';
  description: string;
  category: 'Core Engineering' | 'Mathematics & Theory' | 'Systems & Hardware' | 'Development & Programming' | 'General & Professional';
  coreTopics: string[];
}

export interface SESemesterInfo {
  code: '1.1' | '1.2' | '2.1' | '2.2' | '3.1' | '3.2' | '4.1' | '4.2';
  label: string;
  yearNumber: 1 | 2 | 3 | 4;
  semesterNumber: 1 | 2;
  title: string;
  totalUnits: number;
}

export const SE_SEMESTERS: SESemesterInfo[] = [
  { code: '1.1', label: 'Year 1, Semester 1 (1.1)', yearNumber: 1, semesterNumber: 1, title: 'Foundations & Structured Programming', totalUnits: 7 },
  { code: '1.2', label: 'Year 1, Semester 2 (1.2)', yearNumber: 1, semesterNumber: 2, title: 'Systems Architecture & Discrete Foundations', totalUnits: 7 },
  { code: '2.1', label: 'Year 2, Semester 1 (2.1)', yearNumber: 2, semesterNumber: 1, title: 'Database Systems & Data Structures', totalUnits: 7 },
  { code: '2.2', label: 'Year 2, Semester 2 (2.2)', yearNumber: 2, semesterNumber: 2, title: 'Data Science & Algorithm Design', totalUnits: 7 },
  { code: '3.1', label: 'Year 3, Semester 1 (3.1)', yearNumber: 3, semesterNumber: 1, title: 'Internet & Mobile Systems Programming', totalUnits: 7 },
  { code: '3.2', label: 'Year 3, Semester 2 (3.2)', yearNumber: 3, semesterNumber: 2, title: 'Cloud Computing & Quality Assurance', totalUnits: 7 },
  { code: '4.1', label: 'Year 4, Semester 1 (4.1)', yearNumber: 4, semesterNumber: 1, title: 'Cybersecurity & Real-Time Engineering', totalUnits: 7 },
  { code: '4.2', label: 'Year 4, Semester 2 (4.2)', yearNumber: 4, semesterNumber: 2, title: 'Enterprise Development & Capstone Project', totalUnits: 7 },
];

export const SOFTWARE_ENGINEERING_UNITS: SEUnit[] = [
  // ----------------------------------------------------
  // Year 1, Semester 1 (1.1)
  // ----------------------------------------------------
  {
    code: 'BCU 111',
    title: 'COMMUNICATION SKILLS',
    semesterCode: '1.1',
    year: 'Year 1',
    semester: 'Semester 1',
    description: 'Technical writing, academic presentations, engineering correspondence, and research reporting.',
    category: 'General & Professional',
    coreTopics: ['Technical Reports', 'Academic Writing', 'Oral Presentations', 'Communication Barriers', 'APA/IEEE Referencing']
  },
  {
    code: 'BCU 113',
    title: 'HEALTH AND WELLNESS MANAGEMENT',
    semesterCode: '1.1',
    year: 'Year 1',
    semester: 'Semester 1',
    description: 'Workplace ergonomics, mental resilience, stress management, public health, and healthy developer lifestyles.',
    category: 'General & Professional',
    coreTopics: ['Ergonomics in Computing', 'Mental Health', 'Lifestyle Disease Prevention', 'Stress Inoculation', 'First Aid']
  },
  {
    code: 'BCU 112',
    title: 'DIGITAL LITERACY',
    semesterCode: '1.1',
    year: 'Year 1',
    semester: 'Semester 1',
    description: 'Digital citizenship, cloud productivity tools, cybersecurity hygiene, and collaborative digital workspaces.',
    category: 'General & Professional',
    coreTopics: ['Cloud Collaboration', 'Digital Ethics', 'Information Retrieval', 'Data Protection', 'Spreadsheet Analytics']
  },
  {
    code: 'BSD 111',
    title: 'STRUCTURED PROGRAMMING AND ALGORITHMS',
    semesterCode: '1.1',
    year: 'Year 1',
    semester: 'Semester 1',
    description: 'Procedural problem solving in C/C++, control structures, modular functions, pointers, arrays, and file streams.',
    category: 'Development & Programming',
    coreTopics: ['Control Flow', 'Pointers & Memory Allocation', 'Modular Decomposition', 'Arrays & Strings', 'File I/O', 'Pseudocode']
  },
  {
    code: 'MAT 111',
    title: 'BASIC MATHEMATICS',
    semesterCode: '1.1',
    year: 'Year 1',
    semester: 'Semester 1',
    description: 'Algebraic equations, trigonometry, vectors, matrices, coordinate geometry, and sequence series for engineering.',
    category: 'Mathematics & Theory',
    coreTopics: ['Matrix Inverses & Determinants', 'Vectors & Dot Products', 'Trigonometry', 'Polynomial Roots', 'Binomial Theorem']
  },
  {
    code: 'BSD 112',
    title: 'FUNDAMENTALS OF SOFTWARE ENGINEERING',
    semesterCode: '1.1',
    year: 'Year 1',
    semester: 'Semester 1',
    description: 'SDLC models (Waterfall, Agile, Scrum), requirements engineering, software lifecycles, and professional ethics.',
    category: 'Core Engineering',
    coreTopics: ['SDLC Methodologies', 'Agile & Scrum', 'Requirements Engineering', 'SRS Documentation', 'Software Ethics']
  },
  {
    code: 'BSD 113',
    title: 'INTRODUCTION TO COMPUTER SYSTEMS',
    semesterCode: '1.1',
    year: 'Year 1',
    semester: 'Semester 2',
    description: 'Von Neumann architectures, number systems (Binary, Hex), data representation, peripheral interfacing, and basic system utilities.',
    category: 'Systems & Hardware',
    coreTopics: ['Von Neumann Architecture', 'Binary Arithmetic & 2s Complement', 'Data Representation', 'Peripheral Interfaces', 'System Utilities']
  },

  // ----------------------------------------------------
  // Year 1, Semester 2 (1.2)
  // ----------------------------------------------------
  {
    code: 'BCE 121',
    title: 'COMPUTER ORGANIZATION AND ARCHITECTURE',
    semesterCode: '1.2',
    year: 'Year 1',
    semester: 'Semester 2',
    description: 'Digital logic gates, ALU design, RISC vs CISC instruction sets, CPU pipeline, cache hierarchy, and assembly.',
    category: 'Systems & Hardware',
    coreTopics: ['Logic Gates & Karnaugh Maps', 'RISC vs CISC', 'Instruction Cycle', 'Cache Mapping', 'Pipelining Hazards']
  },
  {
    code: 'BCT 121',
    title: 'OPERATING SYSTEMS',
    semesterCode: '1.2',
    year: 'Year 1',
    semester: 'Semester 2',
    description: 'Process scheduling, concurrency, semaphores, deadlock resolution, virtual memory, paging, and file systems.',
    category: 'Systems & Hardware',
    coreTopics: ['Process Scheduling', 'Semaphores & Mutexes', 'Bankers Deadlock Algorithm', 'Virtual Memory & TLBs', 'Page Replacement']
  },
  {
    code: 'MAT 121',
    title: 'DISCRETE MATHEMATICS',
    semesterCode: '1.2',
    year: 'Year 1',
    semester: 'Semester 2',
    description: 'Set theory, predicate logic, relations, graph theory, trees, boolean algebra, and proof techniques.',
    category: 'Mathematics & Theory',
    coreTopics: ['Propositional Logic', 'Proof by Induction', 'Set Relations & Equivalence', 'Graph Colorings', 'Trees & Euler Cycles']
  },
  {
    code: 'STA 123',
    title: 'PROBABILITY AND STATISTICS I',
    semesterCode: '1.2',
    year: 'Year 1',
    semester: 'Semester 2',
    description: 'Descriptive stats, probability distributions (Binomial, Poisson, Normal), random variables, and hypothesis testing.',
    category: 'Mathematics & Theory',
    coreTopics: ['Bayes Theorem', 'Normal Distribution', 'Poisson & Binomial Models', 'Expectation & Variance', 'Confidence Intervals']
  },
  {
    code: 'BSD 121',
    title: 'SOFTWARE DESIGN METHODS AND ARCHITECTURES',
    semesterCode: '1.2',
    year: 'Year 1',
    semester: 'Semester 2',
    description: 'Architectural styles (Layered, Client-Server, MVC, Microservices), UML modeling, design patterns, and cohesion.',
    category: 'Core Engineering',
    coreTopics: ['MVC & Microservices', 'UML Class & Sequence Diagrams', 'Coupling & Cohesion', 'Creational Patterns', 'Architectural Views']
  },
  {
    code: 'BSD 122',
    title: 'OBJECT ORIENTED PROGRAMMING I',
    semesterCode: '1.2',
    year: 'Year 1',
    semester: 'Semester 2',
    description: 'OOP core pillars (Encapsulation, Inheritance, Polymorphism, Abstraction) in Java/C++, interfaces, and exceptions.',
    category: 'Development & Programming',
    coreTopics: ['Encapsulation & Access Modifiers', 'Inheritance Hierarchies', 'Dynamic Polymorphism', 'Abstract Classes', 'Exception Handling']
  },
  {
    code: 'BSD 123',
    title: 'WEB DESIGN AND USER EXPERIENCE FOUNDATIONS',
    semesterCode: '1.2',
    year: 'Year 1',
    semester: 'Semester 2',
    description: 'Information architecture, wireframing, responsive layouts with CSS/Flexbox, semantic markup, and web usability guidelines.',
    category: 'Development & Programming',
    coreTopics: ['Responsive Web Design', 'Semantic HTML5 & CSS3', 'Information Architecture', 'Usability Principles', 'CSS Grid Layouts']
  },

  // ----------------------------------------------------
  // Year 2, Semester 1 (2.1)
  // ----------------------------------------------------
  {
    code: 'BDM 121',
    title: 'DATABASE MANAGEMENT SYSTEMS',
    semesterCode: '2.1',
    year: 'Year 2',
    semester: 'Semester 1',
    description: 'Relational algebra, SQL DDL/DML, Boyce-Codd normal forms, ACID transactions, indexing, and recovery.',
    category: 'Core Engineering',
    coreTopics: ['ACID Transactions', 'BCNF Normalization', 'B+ Tree Indexing', 'Two-Phase Locking (2PL)', 'SQL Joins & Triggers']
  },
  {
    code: 'BSD 211',
    title: 'DATA STRUCTURES AND ALGORITHMS',
    semesterCode: '2.1',
    year: 'Year 2',
    semester: 'Semester 1',
    description: 'Stacks, queues, linked lists, self-balancing AVL trees, heaps, hash tables, asymptotic Big-O, and sorting.',
    category: 'Core Engineering',
    coreTopics: ['AVL Trees & Rotations', 'Hash Tables & Collisions', 'Heaps & Priority Queues', 'Graph Traversal (BFS/DFS)', 'Master Theorem']
  },
  {
    code: 'BSD 213',
    title: 'OBJECT ORIENTED SOFTWARE DESIGN METHODS',
    semesterCode: '2.1',
    year: 'Year 2',
    semester: 'Semester 1',
    description: 'SOLID design principles, GoF design patterns (Singleton, Factory, Observer, Strategy), and refactoring.',
    category: 'Core Engineering',
    coreTopics: ['SOLID Principles', 'GoF Design Patterns', 'Dependency Injection', 'Refactoring Smells', 'Behavioral Patterns']
  },
  {
    code: 'BSD 214',
    title: 'OBJECT ORIENTED PROGRAMMING II',
    semesterCode: '2.1',
    year: 'Year 2',
    semester: 'Semester 1',
    description: 'Advanced Java/C#, multithreading, concurrency locks, stream API, generics, reflection, and GUI desktop frameworks.',
    category: 'Development & Programming',
    coreTopics: ['Multithreading & Locks', 'Generics & Wildcards', 'Functional Streams & Lambdas', 'Reflection & Annotations', 'Network Sockets']
  },
  {
    code: 'BCE 212',
    title: 'COMPUTER SUPPORT AND MAINTENANCE',
    semesterCode: '2.1',
    year: 'Year 2',
    semester: 'Semester 1',
    description: 'Hardware diagnostics, BIOS/UEFI configuration, preventive maintenance, driver configurations, and troubleshooting.',
    category: 'Systems & Hardware',
    coreTopics: ['Hardware Diagnostics', 'UEFI/BIOS Setup', 'Storage RAID Arrays', 'Motherboard Architectures', 'Thermal Management']
  },
  {
    code: 'MAT 120',
    title: 'CALCULUS I',
    semesterCode: '2.1',
    year: 'Year 2',
    semester: 'Semester 1',
    description: 'Limits, continuity, differential calculus, chain rule, implicit differentiation, optimization, and integration basics.',
    category: 'Mathematics & Theory',
    coreTopics: ['Limits & L\'Hopital\'s Rule', 'Optimization & Extreme Values', 'Chain Rule & Derivatives', 'Integration Techniques', 'Related Rates']
  },
  {
    code: 'BSD 215',
    title: 'ASSEMBLY LANGUAGE AND LOW-LEVEL PROGRAMMING',
    semesterCode: '2.1',
    year: 'Year 2',
    semester: 'Semester 1',
    description: 'x86/ARM assembly, CPU registers, stack frame management, interrupts, memory segmentation, and C ABI interop.',
    category: 'Systems & Hardware',
    coreTopics: ['x86/ARM Register Architecture', 'Stack Frames & Calling Conventions', 'Interrupt Handling & Syscalls', 'Bitwise Manipulation', 'C Assembly Inline Hooks']
  },

  // ----------------------------------------------------
  // Year 2, Semester 2 (2.2)
  // ----------------------------------------------------
  {
    code: 'BDM 221',
    title: 'DATA SCIENCE',
    semesterCode: '2.2',
    year: 'Year 2',
    semester: 'Semester 2',
    description: 'Data wrangling (Pandas, NumPy), exploratory data analysis, regression, classification, clustering, and model metrics.',
    category: 'Core Engineering',
    coreTopics: ['Data Wrangling (Pandas)', 'Supervised vs Unsupervised ML', 'Scikit-Learn Pipelines', 'Feature Engineering', 'Confusion Matrix & ROC']
  },
  {
    code: 'BSD 223',
    title: 'MOBILE COMPUTING',
    semesterCode: '2.2',
    year: 'Year 2',
    semester: 'Semester 2',
    description: 'Mobile operating systems, battery constraints, responsive interfaces, wireless protocols (BLE, 5G, Wi-Fi), and sensors.',
    category: 'Development & Programming',
    coreTopics: ['Mobile OS Architectures', 'Sensor Integration', 'Power Optimization', 'Wireless Data Transmission', 'Cross-Platform Frameworks']
  },
  {
    code: 'BSD 226',
    title: 'SOFTWARE METRICS',
    semesterCode: '2.2',
    year: 'Year 2',
    semester: 'Semester 2',
    description: 'Cyclomatic complexity, Halstead metrics, Function Point Analysis (FPA), code coverage, defect density, and COCOMO.',
    category: 'Core Engineering',
    coreTopics: ['McCabe Cyclomatic Complexity', 'Function Point Analysis (FPA)', 'COCOMO Cost Estimation', 'Code Smells & Coverage', 'Defect Metrics']
  },
  {
    code: 'BNT 221',
    title: 'DATA COMMUNICATION AND COMPUTER NETWORKS',
    semesterCode: '2.2',
    year: 'Year 2',
    semester: 'Semester 2',
    description: 'OSI 7-layer & TCP/IP models, IP addressing, subnetting (VLSM), routing protocols (OSPF, BGP), and transport protocols.',
    category: 'Systems & Hardware',
    coreTopics: ['OSI vs TCP/IP Models', 'IPv4/IPv6 Subnetting (VLSM)', 'TCP 3-Way Handshake & UDP', 'OSPF & BGP Routing', 'DNS & HTTP/3']
  },
  {
    code: 'BSD 222',
    title: 'DESIGN AND ANALYSIS OF ALGORITHMS',
    semesterCode: '2.2',
    year: 'Year 2',
    semester: 'Semester 2',
    description: 'Dynamic programming, greedy algorithms, divide and conquer, amortized analysis, NP-completeness, and graph flows.',
    category: 'Core Engineering',
    coreTopics: ['Dynamic Programming (0/1 Knapsack)', 'Greedy Algorithms (Huffman)', 'Ford-Fulkerson Max Flow', 'NP-Completeness Proofs', 'Amortized Complexity']
  },
  {
    code: 'BDM 222',
    title: 'ADVANCED DATABASE DEVELOPMENT',
    semesterCode: '2.2',
    year: 'Year 2',
    semester: 'Semester 2',
    description: 'NoSQL document/key-value stores (MongoDB, Redis), distributed databases, sharding, replication, and query execution.',
    category: 'Core Engineering',
    coreTopics: ['NoSQL Data Modeling', 'MongoDB Aggregation Pipelines', 'CAP Theorem & Base Consistency', 'Sharding & Replication', 'Redis In-Memory Caching']
  },
  {
    code: 'BSD 227',
    title: 'ARTIFICIAL INTELLIGENCE FUNDAMENTALS',
    semesterCode: '2.2',
    year: 'Year 2',
    semester: 'Semester 2',
    description: 'Search algorithms (A*, minimax, alpha-beta), knowledge representation, expert systems, neural net basics, and prompt engineering.',
    category: 'Core Engineering',
    coreTopics: ['A* & Heuristic Search', 'Minimax & Game Trees', 'Propositional Inference', 'Artificial Neural Networks', 'Ethics in AI & Automation']
  },

  // ----------------------------------------------------
  // Year 3, Semester 1 (3.1)
  // ----------------------------------------------------
  {
    code: 'BSD 313',
    title: 'INTERNET PROGRAMMING I',
    semesterCode: '3.1',
    year: 'Year 3',
    semester: 'Semester 1',
    description: 'Full-stack client architecture, HTML5/CSS3 semantic layouts, modern JavaScript ES6+, DOM manipulation, and REST APIs.',
    category: 'Development & Programming',
    coreTopics: ['RESTful Web Services', 'Asynchronous JS (Promises/Async)', 'DOM Tree Manipulation', 'CSS Grid & Flexbox', 'HTTP Headers & CORS']
  },
  {
    code: 'BSD 225',
    title: 'NETWORK ENGINEERING AND PROGRAMMING',
    semesterCode: '3.1',
    year: 'Year 3',
    semester: 'Semester 1',
    description: 'Socket programming (TCP/UDP in Python/C), network packet sniffing, VLAN configurations, and SDN network controllers.',
    category: 'Systems & Hardware',
    coreTopics: ['Socket Programming (TCP/UDP)', 'Packet Sniffing (Wireshark)', 'VLANs & Trunking', 'Software-Defined Networking', 'Network Daemons']
  },
  {
    code: 'BSD 312',
    title: 'MOBILE PROGRAMMING I',
    semesterCode: '3.1',
    year: 'Year 3',
    semester: 'Semester 1',
    description: 'Native Android development using Kotlin, Activities, Fragments, ViewModels, Room local DB, and Jetpack Compose.',
    category: 'Development & Programming',
    coreTopics: ['Android Lifecycle & Intents', 'Jetpack Compose / XML Layouts', 'Room SQLite Database', 'Coroutines & Retrofit', 'Android Services']
  },
  {
    code: 'BSD 311',
    title: 'SIMULATION AND MODELLING',
    semesterCode: '3.1',
    year: 'Year 3',
    semester: 'Semester 1',
    description: 'Discrete event simulation, Monte Carlo methods, pseudo-random number generators, queuing models (M/M/1), and verification.',
    category: 'Mathematics & Theory',
    coreTopics: ['Discrete Event Simulation', 'Monte Carlo Methods', 'Queuing Theory (M/M/1)', 'Random Variate Generation', 'Simul8 / Python Simulation']
  },
  {
    code: 'BSD 316',
    title: 'VISUAL PROGRAMMING',
    semesterCode: '3.1',
    year: 'Year 3',
    semester: 'Semester 1',
    description: 'Event-driven programming, GUI event loops, component-based graphical systems, C# .NET WPF/Windows Forms, and data binding.',
    category: 'Development & Programming',
    coreTopics: ['Event-Driven Architecture', 'GUI Data Binding', 'WPF / Windows Forms', 'Custom Visual Controls', 'Asynchronous UI Dispatchers']
  },
  {
    code: 'BNT 311',
    title: 'DISTRIBUTED COMPUTING',
    semesterCode: '3.1',
    year: 'Year 3',
    semester: 'Semester 1',
    description: 'Remote Procedure Calls (RPC), gRPC, message queues (Kafka, RabbitMQ), consensus algorithms (Paxos, Raft), and clock sync.',
    category: 'Core Engineering',
    coreTopics: ['gRPC & Protocol Buffers', 'Raft Consensus Algorithm', 'Lamport Logical Clocks', 'Message Queues (Kafka)', 'Distributed Transactions (2PC)']
  },
  {
    code: 'BSD 317',
    title: 'SOFTWARE CONFIGURATION MANAGEMENT',
    semesterCode: '3.1',
    year: 'Year 3',
    semester: 'Semester 1',
    description: 'Git branching strategies (Gitflow), CI/CD automated pipelines, semantic versioning, infrastructure as code, and Docker containers.',
    category: 'Core Engineering',
    coreTopics: ['Git Branching Models (Gitflow)', 'CI/CD Pipelines (GitHub Actions)', 'Docker Containerization', 'Semantic Versioning', 'Release Management']
  },

  // ----------------------------------------------------
  // Year 3, Semester 2 (3.2)
  // ----------------------------------------------------
  {
    code: 'BCT 321',
    title: 'RESEARCH METHODS AND TECHNICAL WRITING',
    semesterCode: '3.2',
    year: 'Year 3',
    semester: 'Semester 2',
    description: 'Research design, literature review methodology, quantitative/qualitative data analysis, academic ethics, and thesis drafting.',
    category: 'General & Professional',
    coreTopics: ['Research Methodologies', 'Literature Review Synthesis', 'Hypothesis Formulation', 'Ethical Approval & Plagiarism', 'LaTeX Document Typesetting']
  },
  {
    code: 'BSD 322',
    title: 'INTERNET PROGRAMMING II',
    semesterCode: '3.2',
    year: 'Year 3',
    semester: 'Semester 2',
    description: 'Advanced full-stack systems, React/Next.js architectures, GraphQL endpoints, WebSockets, JWT authentication, and SSR.',
    category: 'Development & Programming',
    coreTopics: ['React State & Hooks', 'GraphQL Query & Mutations', 'WebSockets & Real-Time Sync', 'JWT & OAuth Authentication', 'Server-Side Rendering (SSR)']
  },
  {
    code: 'BSD 321',
    title: 'USER CENTERED DESIGN',
    semesterCode: '3.2',
    year: 'Year 3',
    semester: 'Semester 2',
    description: 'Heuristic evaluation, Nielsen principles, persona formulation, wireframing/prototyping in Figma, accessibility (WCAG), and usability tests.',
    category: 'Core Engineering',
    coreTopics: ['Nielsen Usability Heuristics', 'Persona Formulation & Journey Maps', 'Interactive Wireframing (Figma)', 'WCAG Accessibility Standards', 'A/B Usability Testing']
  },
  {
    code: 'BSD 323',
    title: 'SOFTWARE TESTING',
    semesterCode: '3.2',
    year: 'Year 3',
    semester: 'Semester 2',
    description: 'Unit testing, TDD, integration testing, boundary value analysis, automated end-to-end testing (Playwright, Jest, JUnit), and mocks.',
    category: 'Core Engineering',
    coreTopics: ['Test-Driven Development (TDD)', 'Boundary Value Analysis (BVA)', 'Equivalence Partitioning', 'Automated E2E Testing (Playwright)', 'Mocking & Stubbing']
  },
  {
    code: 'BDM 321',
    title: 'CLOUD COMPUTING AND SERVICES',
    semesterCode: '3.2',
    year: 'Year 3',
    semester: 'Semester 2',
    description: 'IaaS/PaaS/SaaS architectures, AWS/GCP cloud services, serverless microservices, Terraform IaC, auto-scaling, and cloud security.',
    category: 'Core Engineering',
    coreTopics: ['Cloud Service Models (IaaS/PaaS)', 'Serverless Functions (Cloud Run/Lambda)', 'Terraform Infrastructure as Code', 'Auto-Scaling & Load Balancing', 'Cloud IAM Policies']
  },
  {
    code: 'BSD 324',
    title: 'MOBILE PROGRAMMING II',
    semesterCode: '3.2',
    year: 'Year 3',
    semester: 'Semester 2',
    description: 'Cross-platform mobile engineering with Flutter/React Native, state management (Bloc, Provider), offline storage, and push notifications.',
    category: 'Development & Programming',
    coreTopics: ['Flutter Widget Tree & State', 'Bloc & Provider State Patterns', 'Offline Sync & SQLite', 'Firebase Cloud Messaging (FCM)', 'App Store Deployment']
  },
  {
    code: 'BCT 322',
    title: 'IT PROJECT MANAGEMENT',
    semesterCode: '3.2',
    year: 'Year 3',
    semester: 'Semester 2',
    description: 'Project initiation, Gantt charts, Critical Path Method (CPM), risk mitigation, Agile estimation, sprint planning, and budget management.',
    category: 'General & Professional',
    coreTopics: ['Critical Path Method (CPM)', 'Gantt Chart Scheduling', 'Agile Story Point Estimation', 'Risk Assessment Matrix', 'Stakeholder Management']
  },

  // ----------------------------------------------------
  // Year 4, Semester 1 (4.1)
  // ----------------------------------------------------
  {
    code: 'BSD 411',
    title: 'BUSINESS INTELLIGENCE AND ANALYTICS',
    semesterCode: '4.1',
    year: 'Year 4',
    semester: 'Semester 1',
    description: 'Data warehousing schemas (Star, Snowflake), ETL pipelines, OLAP cubes, PowerBI/Tableau dashboards, and predictive analytics.',
    category: 'Core Engineering',
    coreTopics: ['Data Warehousing (Star/Snowflake)', 'ETL Pipeline Engineering', 'OLAP Cubes & Slicing', 'Business Dashboards (PowerBI)', 'Predictive Business Analytics']
  },
  {
    code: 'BCE 422',
    title: 'REAL-TIME SOFTWARE SYSTEMS',
    semesterCode: '4.1',
    year: 'Year 4',
    semester: 'Semester 1',
    description: 'Hard vs soft real-time constraints, Rate Monotonic Scheduling (RMS), Earliest Deadline First (EDF), priority inversion, and RTOS kernels.',
    category: 'Systems & Hardware',
    coreTopics: ['Hard vs Soft Real-Time', 'Rate Monotonic Scheduling (RMS)', 'Earliest Deadline First (EDF)', 'Priority Inversion & Inheritance', 'RTOS Kernels (FreeRTOS)']
  },
  {
    code: 'BSD 412',
    title: 'GAME DESIGN AND DEVELOPMENT',
    semesterCode: '4.1',
    year: 'Year 4',
    semester: 'Semester 1',
    description: 'Game loop architecture, 2D/3D physics engines, collision detection algorithms (AABB, SAT), Unity C# scripting, and game AI pathfinding.',
    category: 'Development & Programming',
    coreTopics: ['Game Loop & Frame Rates', 'Collision Detection (AABB/SAT)', 'A* Pathfinding in Games', 'Unity C# Component Systems', 'Shaders & Particle FX']
  },
  {
    code: 'BSD 413',
    title: 'SOFTWARE QUALITY ASSURANCE',
    semesterCode: '4.1',
    year: 'Year 4',
    semester: 'Semester 1',
    description: 'ISO 9001 / IEEE software quality standards, CMMI maturity levels, peer code review guidelines, static analysis, and quality audits.',
    category: 'Core Engineering',
    coreTopics: ['IEEE/ISO Software Standards', 'CMMI Maturity Levels (1-5)', 'Static Code Analysis (SonarQube)', 'Peer Code Inspection Processes', 'Software Quality Audits']
  },
  {
    code: 'BCT 412',
    title: 'COMPUTER AND CYBER SECURITY',
    semesterCode: '4.1',
    year: 'Year 4',
    semester: 'Semester 1',
    description: 'Cryptographic algorithms (AES, RSA, ECC), hashing (SHA-256), PKI certificates, OWASP Top 10 vulnerabilities, penetration testing, and zero trust.',
    category: 'Core Engineering',
    coreTopics: ['Public Key Cryptography (RSA/ECC)', 'OWASP Top 10 Security Risks', 'XSS & SQL Injection Defense', 'Zero Trust Architecture', 'Penetration Testing Methodology']
  },
  {
    code: 'BSD 414',
    title: 'DESIGN THINKING',
    semesterCode: '4.1',
    year: 'Year 4',
    semester: 'Semester 1',
    description: 'Empathize, Define, Ideate, Prototype, and Test framework applied to complex engineering challenges and user-centric problem solving.',
    category: 'General & Professional',
    coreTopics: ['Empathy Mapping', 'Problem Statement Reframing', 'Rapid Low-Fi Prototyping', 'User Feedback Synthesis', 'Design Innovation Workshops']
  },
  {
    code: 'BCT 415',
    title: 'PROJECT PROPOSAL',
    semesterCode: '4.1',
    year: 'Year 4',
    semester: 'Semester 1',
    description: 'Capstone project problem formulation, feasibility study, literature survey, system architecture specification, and oral defense.',
    category: 'General & Professional',
    coreTopics: ['Problem Statement Formulation', 'Feasibility & Risk Analysis', 'Architectural Specification', 'Gantt Milestone Defense', 'Proposal Defense']
  },

  // ----------------------------------------------------
  // Year 4, Semester 2 (4.2)
  // ----------------------------------------------------
  {
    code: 'BCT 421',
    title: 'LEGAL AND PROFESSIONAL ETHICS IN COMPUTING',
    semesterCode: '4.2',
    year: 'Year 4',
    semester: 'Semester 2',
    description: 'Data protection laws (GDPR, Kenya Data Protection Act), intellectual property rights, software patents, ACM/IEEE codes of ethics, and cyberlaw.',
    category: 'General & Professional',
    coreTopics: ['Data Privacy Laws (GDPR & KDPA)', 'Software Patents & Copyright', 'ACM/IEEE Code of Ethics', 'Cybercrime Legislation', 'Whistleblowing & Tech Liability']
  },
  {
    code: 'BCU 410',
    title: 'ENTREPRENEURSHIP AND INNOVATION',
    semesterCode: '4.2',
    year: 'Year 4',
    semester: 'Semester 2',
    description: 'Tech venture creation, business model canvas (BMC), MVP validation, venture capital pitch decks, unit economics, and startup scaling.',
    category: 'General & Professional',
    coreTopics: ['Business Model Canvas (BMC)', 'MVP Customer Validation', 'Tech Startup Financials & Valuation', 'Pitch Deck Presentation', 'Intellectual Property Strategy']
  },
  {
    code: 'BSD 421',
    title: 'ENTERPRISE APPLICATIONS DEVELOPMENT',
    semesterCode: '4.2',
    year: 'Year 4',
    semester: 'Semester 2',
    description: 'Enterprise integration patterns (EIP), microservices event-driven architectures, Spring Boot / .NET Enterprise, domain-driven design (DDD), and Kubernetes.',
    category: 'Core Engineering',
    coreTopics: ['Domain-Driven Design (DDD)', 'Spring Boot Microservices', 'Event-Driven Architecture (Kafka)', 'Kubernetes Orchestration', 'Enterprise Integration Patterns']
  },
  {
    code: 'BCT 425',
    title: 'FINAL PROJECT',
    semesterCode: '4.2',
    year: 'Year 4',
    semester: 'Semester 2',
    description: 'Execution and deployment of production-ready capstone software system, rigorous testing, technical documentation, and final faculty defense.',
    category: 'Core Engineering',
    coreTopics: ['Full-Stack Implementation', 'Performance & Load Testing', 'Final Thesis Documentation', 'Production Deployment', 'Grand Jury Faculty Defense']
  },
  {
    code: 'BDM 411',
    title: 'GEOGRAPHICAL INFORMATION SYSTEMS',
    semesterCode: '4.2',
    year: 'Year 4',
    semester: 'Semester 2',
    description: 'Spatial data structures, PostGIS spatial queries, coordinate reference systems (CRS), GeoJSON mapping, remote sensing, and spatial indexing (R-Tree).',
    category: 'Core Engineering',
    coreTopics: ['Spatial Data Models (Vector/Raster)', 'PostGIS Spatial SQL Queries', 'Coordinate Systems (WGS84)', 'R-Tree Spatial Indexing', 'Leaflet & Mapbox Web GIS']
  },
  {
    code: 'BCU 401',
    title: 'INDUSTRIAL ATTACHMENT',
    semesterCode: '4.2',
    year: 'Year 4',
    semester: 'Semester 2',
    description: 'Full-time field internship in software engineering firms, industry problem solving, workplace mentorship, and supervisory field assessment.',
    category: 'General & Professional',
    coreTopics: ['Industry Workflow Ingestion', 'Professional Team Collaboration', 'Field Problem Solving', 'Workplace Supervisory Assessment', 'Internship Logbook Defense']
  },
  {
    code: 'BSD 422',
    title: 'DEVOPS ENGINEERING & SITE RELIABILITY',
    semesterCode: '4.2',
    year: 'Year 4',
    semester: 'Semester 2',
    description: 'Infrastructure automation, GitOps with ArgoCD, Kubernetes ingress, Prometheus/Grafana observability, Chaos engineering, and SLO/SLA management.',
    category: 'Core Engineering',
    coreTopics: ['GitOps (ArgoCD)', 'Kubernetes Cluster Administration', 'Observability (Prometheus/Grafana)', 'SLO & Error Budgets', 'Site Reliability Engineering (SRE)']
  }
];

export function getUnitsBySemester(semesterCode: '1.1' | '1.2' | '2.1' | '2.2' | '3.1' | '3.2' | '4.1' | '4.2'): SEUnit[] {
  return SOFTWARE_ENGINEERING_UNITS.filter(u => u.semesterCode === semesterCode);
}

export function searchSEUnits(query: string): SEUnit[] {
  if (!query || !query.trim()) return SOFTWARE_ENGINEERING_UNITS;
  const clean = query.toLowerCase().trim();
  return SOFTWARE_ENGINEERING_UNITS.filter(u => 
    u.code.toLowerCase().includes(clean) ||
    u.title.toLowerCase().includes(clean) ||
    u.semesterCode.toLowerCase().includes(clean) ||
    u.category.toLowerCase().includes(clean) ||
    u.coreTopics.some(t => t.toLowerCase().includes(clean))
  );
}
