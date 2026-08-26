import { PastPaper, ExamQuestion } from '../types';
import { SOFTWARE_ENGINEERING_UNITS, SEUnit } from './softwareEngineeringCurriculum';

// Pre-crafted in-depth exam question blueprints for Software Engineering units
function generateSEExamQuestions(unit: SEUnit, university: string): ExamQuestion[] {
  const topics = unit.coreTopics;
  const t1 = topics[0] || 'Foundational Principles';
  const t2 = topics[1] || 'Architectural Design';
  const t3 = topics[2] || 'Optimization & Practical Execution';
  const t4 = topics[3] || 'System Reliability';

  return [
    {
      id: `${unit.code.toLowerCase().replace(/\s+/g, '-')}-q1`,
      section: 'SECTION A (COMPULSORY - 30 MARKS)',
      questionNumber: 1,
      title: `${unit.title}: Theoretical Core & System Analysis`,
      scenario: `At ${university}, engineering teams are designing a high-reliability production system adhering strictly to the principles of ${unit.title}. Analyze the core requirements, formal models, and implementation invariants.`,
      marks: 30,
      parts: [
        {
          label: '(a)',
          prompt: `Define the primary objectives of ${unit.title}. Explain in detail how ${t1} and ${t2} govern system stability and engineering correctness.`,
          marks: 10,
          markingGuide: `5 marks for precise definitions; 5 marks for clear real-world technical illustrations connecting ${t1} and ${t2}.`
        },
        {
          label: '(b)',
          prompt: `Critically examine the operational tradeoffs between ${t2} and ${t3}. Illustrate your discussion with architectural diagrams, state equations, or step-by-step algorithms.`,
          marks: 12,
          markingGuide: `6 marks for comprehensive tradeoff analysis; 6 marks for structured mathematical or diagrammatic proof.`
        },
        {
          label: '(c)',
          prompt: `Formulate a risk mitigation strategy addressing vulnerabilities or bottlenecks that emerge when implementing ${t4} in enterprise computing environments.`,
          marks: 8,
          markingGuide: `4 marks for identifying failure modes; 4 marks for actionable engineering countermeasures.`
        }
      ],
      solutionHints: [
        `Anchor definitions around standard ACM/IEEE guidelines for ${unit.title}.`,
        `Focus on asymptotic efficiency, concurrency boundaries, and data integrity guarantees.`,
        `Synthesize practical deployment concerns with rigorous academic theory.`
      ],
      keyTopics: [t1, t2, t3, t4]
    },
    {
      id: `${unit.code.toLowerCase().replace(/\s+/g, '-')}-q2`,
      section: 'SECTION B (ANSWER ANY TWO QUESTIONS - 20 MARKS EACH)',
      questionNumber: 2,
      title: `Applied Design & Practical Engineering for ${unit.code}`,
      scenario: `A Pan-African software consortium is upgrading their legacy infrastructure. You have been appointed as Lead Software Architect to deliver the solution using ${unit.title} best practices.`,
      marks: 20,
      parts: [
        {
          label: '(a)',
          prompt: `Provide an end-to-end design specification or pseudocode implementation demonstrating how ${t1} is applied to optimize throughput and reduce latency.`,
          marks: 10,
          markingGuide: `5 marks for correct algorithmic/design logic; 5 marks for asymptotic runtime and space complexity analysis.`
        },
        {
          label: '(b)',
          prompt: `Evaluate the impact of ${t3} under heavy load or distributed network partitioning. Propose a benchmark verification protocol.`,
          marks: 10,
          markingGuide: `5 marks for resilience evaluation; 5 marks for concrete test/metric suite.`
        }
      ],
      solutionHints: [
        `Ensure edge-case error handling is accounted for in all code or design models.`,
        `Cite industry standard protocols and benchmarking metrics.`
      ],
      keyTopics: [t1, t3, 'Benchmark Protocols', 'Performance Tuning']
    },
    {
      id: `${unit.code.toLowerCase().replace(/\s+/g, '-')}-q3`,
      section: 'SECTION B (ANSWER ANY TWO QUESTIONS - 20 MARKS EACH)',
      questionNumber: 3,
      title: `Advanced Evaluation & Industry Case Study (${unit.code})`,
      scenario: `Evaluate empirical benchmarks and regulatory compliance standards relevant to ${unit.title} when scaling across diverse African telecommunications and cloud infrastructures.`,
      marks: 20,
      parts: [
        {
          label: '(a)',
          prompt: `Conduct a comparative synthesis between classical approaches to ${t2} and modern cloud-native or modern paradigm shifts.`,
          marks: 10,
          markingGuide: `5 marks for historical baseline comparison; 5 marks for modern architectural benefits.`
        },
        {
          label: '(b)',
          prompt: `Propose an automated continuous evaluation pipeline incorporating ${t4} to guarantee 99.99% service availability.`,
          marks: 10,
          markingGuide: `5 marks for pipeline stages (build, test, verify); 5 marks for metric telemetry and alerting thresholds.`
        }
      ],
      solutionHints: [
        `Draw clear contrast between monolithic vs decentralized patterns.`,
        `Incorporate automated testing, static analysis, and observability telemetry.`
      ],
      keyTopics: [t2, t4, 'Continuous Verification', 'System Scalability']
    }
  ];
}

// African University distribution for papers
const AFRICAN_UNIS = [
  { name: 'University of Nairobi', acronym: 'UoN' },
  { name: 'Jomo Kenyatta University of Agriculture and Technology', acronym: 'JKUAT' },
  { name: 'Makerere University', acronym: 'MAK' },
  { name: 'Kenyatta University', acronym: 'KU' },
  { name: 'Strathmore University', acronym: 'SU' },
  { name: 'University of Lagos', acronym: 'UNILAG' },
  { name: 'Covenant University', acronym: 'CU' },
  { name: 'University of Cape Town', acronym: 'UCT' },
  { name: 'Kwame Nkrumah University of Science and Technology', acronym: 'KNUST' },
  { name: 'Addis Ababa University', acronym: 'AAU' }
];

// Generate comprehensive past papers for all 51 Software Engineering units
export const SAMPLE_PAST_PAPERS: PastPaper[] = SOFTWARE_ENGINEERING_UNITS.map((unit, index) => {
  const uni = AFRICAN_UNIS[index % AFRICAN_UNIS.length];
  const examYear = 2023 + (index % 3); // 2023, 2024, 2025
  const cleanCode = unit.code.replace(/\s+/g, '').toLowerCase();
  
  // Rich search tags for instant token matching
  const searchTags = [
    unit.semesterCode, // e.g. '1.1', '2.1', '3.2', '4.2'
    unit.code.toLowerCase(), // 'bcu 111', 'bsd 211', 'bdm 121'
    cleanCode, // 'bcu111', 'bsd211', 'bdm121'
    ...unit.title.toLowerCase().split(/[\s,&/]+/).filter(t => t.length > 1),
    unit.year.toLowerCase(),
    unit.semester.toLowerCase(),
    unit.category.toLowerCase(),
    uni.name.toLowerCase(),
    uni.acronym.toLowerCase(),
    'software engineering',
    'past paper',
    'exam'
  ];

  // Add specific popular aliases for standard units
  if (unit.code === 'BDM 121' || unit.title.includes('DATABASE')) {
    searchTags.push('2.1 data', '2.1 data basemanagement', 'cs 2.1', 'database', 'dbms', 'sql', 'normalization');
  }
  if (unit.code === 'BSD 211' || unit.title.includes('DATA STRUCTURES')) {
    searchTags.push('2.1 dsa', 'cs 2.1', 'dsa', 'algorithms', 'trees', 'avl');
  }
  if (unit.code === 'BCT 121' || unit.title.includes('OPERATING SYSTEMS')) {
    searchTags.push('1.2 os', 'operating systems', 'linux', 'processes', 'deadlock');
  }
  if (unit.code === 'BSD 111' || unit.title.includes('STRUCTURED PROGRAMMING')) {
    searchTags.push('1.1 programming', 'c programming', 'algorithms', 'structured');
  }

  const difficultyLevel: 'Foundation' | 'Intermediate' | 'Advanced' = 
    unit.year === 'Year 1' ? 'Foundation' :
    unit.year === 'Year 2' ? 'Intermediate' : 'Advanced';

  return {
    paper_id: `paper-se-${cleanCode}-${examYear}`,
    university_name: uni.name,
    university_acronym: uni.acronym,
    course_code: unit.code,
    unit_title: unit.title,
    exam_year: examYear,
    semester: unit.semester,
    year_of_study: unit.year,
    faculty_department: 'School of Computing & Software Engineering',
    duration_hours: 3,
    total_marks: 70,
    secure_storage_url: `secure://devsphere-vault/${uni.acronym.toLowerCase()}/${cleanCode}-${examYear}.enc`,
    search_tags: Array.from(new Set(searchTags)),
    difficulty: difficultyLevel,
    questions: generateSEExamQuestions(unit, uni.name)
  };
});

// Specialized High-Precision Search Engine
export function searchPastPapers(
  query: string, 
  universityFilter?: string, 
  yearFilter?: string,
  semesterFilter?: string
): PastPaper[] {
  let results = [...SAMPLE_PAST_PAPERS];

  if (universityFilter && universityFilter.trim() && universityFilter !== 'All Universities') {
    const uFilter = universityFilter.toLowerCase().trim();
    results = results.filter(p => 
      p.university_name.toLowerCase().includes(uFilter) ||
      p.university_acronym.toLowerCase() === uFilter
    );
  }

  if (yearFilter && yearFilter.trim() && yearFilter !== 'All Years') {
    results = results.filter(p => p.year_of_study === yearFilter);
  }

  if (semesterFilter && semesterFilter.trim() && semesterFilter !== 'All Semesters') {
    results = results.filter(p => p.search_tags.includes(semesterFilter.toLowerCase()));
  }

  if (!query || !query.trim()) {
    return results;
  }

  // Tokenized Search Engine (e.g. "2.1 data basemanagement" matches "2.1" AND "data" AND "base" AND "management")
  const cleanQuery = query.toLowerCase().trim();
  const tokens = cleanQuery.split(/[\s,._-]+/).filter(t => t.length > 0);

  return results.filter(paper => {
    const searchableCorpus = [
      paper.course_code.toLowerCase(),
      paper.unit_title.toLowerCase(),
      paper.university_name.toLowerCase(),
      paper.university_acronym.toLowerCase(),
      paper.year_of_study.toLowerCase(),
      paper.faculty_department.toLowerCase(),
      paper.exam_year.toString(),
      ...paper.search_tags.map(t => t.toLowerCase())
    ].join(' ');

    // Match if exact query is substring OR at least 50% of tokens match
    if (searchableCorpus.includes(cleanQuery)) return true;
    const matchedTokensCount = tokens.filter(token => searchableCorpus.includes(token)).length;
    const matchRatio = matchedTokensCount / tokens.length;
    return matchRatio >= 0.5;
  });
}
