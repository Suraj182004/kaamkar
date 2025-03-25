import { Exercise } from './firebase/exercises';

// Default exercises organized by category
export const defaultExercises: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Chest Exercises
  {
    name: 'Bench Press',
    category: 'chest',
    equipment: 'barbell',
    isCustom: false,
    description: 'A compound exercise that targets the chest, shoulders, and triceps.',
    instructions: 'Lie on a flat bench, grip the barbell with hands slightly wider than shoulder-width apart, lower the bar to your chest, and press back up.'
  },
  {
    name: 'Incline Bench Press',
    category: 'chest',
    equipment: 'barbell',
    isCustom: false,
    description: 'Targets the upper chest, shoulders, and triceps.',
    instructions: 'Perform a bench press on an incline bench set to 15-30 degrees.'
  },
  {
    name: 'Dumbbell Fly',
    category: 'chest',
    equipment: 'dumbbell',
    isCustom: false,
    description: 'Isolation exercise for the chest.',
    instructions: 'Lie on a flat bench with dumbbells extended above your chest, lower them out to the sides in an arc motion, then bring them back together.'
  },
  {
    name: 'Push-Up',
    category: 'chest',
    equipment: 'bodyweight',
    isCustom: false,
    description: 'Bodyweight exercise for chest, shoulders, and triceps.',
    instructions: 'Start in a plank position with hands shoulder-width apart, lower your body until your chest nearly touches the floor, then push back up.'
  },
  {
    name: 'Cable Crossover',
    category: 'chest',
    equipment: 'cable',
    isCustom: false,
    description: 'Isolation exercise for the chest that provides constant tension.',
    instructions: 'Stand between two cable machines, grab the handles, and bring your hands together in front of your chest in an arc motion.'
  },

  // Back Exercises
  {
    name: 'Pull-Up',
    category: 'back',
    equipment: 'bodyweight',
    isCustom: false,
    description: 'Compound exercise for the back and biceps.',
    instructions: 'Hang from a bar with palms facing away, pull yourself up until your chin is over the bar, then lower back down.'
  },
  {
    name: 'Bent-Over Row',
    category: 'back',
    equipment: 'barbell',
    isCustom: false,
    description: 'Compound exercise for the back and biceps.',
    instructions: 'Bend at the hips with a slight bend in your knees, grip the barbell shoulder-width apart, and pull it toward your lower chest.'
  },
  {
    name: 'Lat Pulldown',
    category: 'back',
    equipment: 'machine',
    isCustom: false,
    description: 'Machine exercise targeting the latissimus dorsi.',
    instructions: 'Sit at a lat pulldown machine, grab the bar with a wide grip, and pull it down to your upper chest.'
  },
  {
    name: 'Seated Cable Row',
    category: 'back',
    equipment: 'cable',
    isCustom: false,
    description: 'Compound exercise for the middle back.',
    instructions: 'Sit at a cable row machine, grab the handle, and pull it toward your lower abdomen while keeping your back straight.'
  },
  {
    name: 'Deadlift',
    category: 'back',
    equipment: 'barbell',
    isCustom: false,
    description: 'Compound exercise for the entire posterior chain.',
    instructions: 'Stand with feet hip-width apart, bend down and grip the barbell, then lift by straightening your hips and knees.'
  },

  // Legs Exercises
  {
    name: 'Squat',
    category: 'legs',
    equipment: 'barbell',
    isCustom: false,
    description: 'Compound exercise for the entire lower body.',
    instructions: 'Place a barbell on your upper back, bend your knees and hips to lower your body, then return to standing.'
  },
  {
    name: 'Leg Press',
    category: 'legs',
    equipment: 'machine',
    isCustom: false,
    description: 'Machine exercise targeting the quadriceps, hamstrings, and glutes.',
    instructions: 'Sit in the leg press machine, place your feet shoulder-width apart on the platform, and press it away by extending your knees.'
  },
  {
    name: 'Romanian Deadlift',
    category: 'legs',
    equipment: 'barbell',
    isCustom: false,
    description: 'Exercise targeting the hamstrings and lower back.',
    instructions: 'Hold a barbell at hip level, hinge at the hips while keeping your back straight, lower the bar along your legs, then return to standing.'
  },
  {
    name: 'Leg Extension',
    category: 'legs',
    equipment: 'machine',
    isCustom: false,
    description: 'Isolation exercise for the quadriceps.',
    instructions: 'Sit in a leg extension machine, hook your feet under the pad, and extend your knees to lift the weight.'
  },
  {
    name: 'Leg Curl',
    category: 'legs',
    equipment: 'machine',
    isCustom: false,
    description: 'Isolation exercise for the hamstrings.',
    instructions: 'Lie on a leg curl machine, place your legs under the pad, and curl the weight by bending your knees.'
  },

  // Shoulders Exercises
  {
    name: 'Overhead Press',
    category: 'shoulders',
    equipment: 'barbell',
    isCustom: false,
    description: 'Compound exercise for the shoulders and triceps.',
    instructions: 'Stand with a barbell at shoulder height, press it overhead until your arms are fully extended, then lower it back to your shoulders.'
  },
  {
    name: 'Lateral Raise',
    category: 'shoulders',
    equipment: 'dumbbell',
    isCustom: false,
    description: 'Isolation exercise for the lateral deltoids.',
    instructions: 'Stand with dumbbells at your sides, raise them out to the sides until they reach shoulder level, then lower them back down.'
  },
  {
    name: 'Front Raise',
    category: 'shoulders',
    equipment: 'dumbbell',
    isCustom: false,
    description: 'Isolation exercise for the anterior deltoids.',
    instructions: 'Stand with dumbbells in front of your thighs, raise them to shoulder level in front of you, then lower them back down.'
  },
  {
    name: 'Face Pull',
    category: 'shoulders',
    equipment: 'cable',
    isCustom: false,
    description: 'Exercise for the rear deltoids and upper back.',
    instructions: 'Stand in front of a cable machine with a rope attachment, pull the rope toward your face while keeping your elbows high.'
  },
  {
    name: 'Upright Row',
    category: 'shoulders',
    equipment: 'barbell',
    isCustom: false,
    description: 'Compound exercise for the shoulders and traps.',
    instructions: 'Stand with a barbell at your thighs, pull it up toward your chin while keeping it close to your body, then lower it back down.'
  },

  // Arms Exercises
  {
    name: 'Bicep Curl',
    category: 'arms',
    equipment: 'dumbbell',
    isCustom: false,
    description: 'Isolation exercise for the biceps.',
    instructions: 'Stand with dumbbells at your sides, curl them up toward your shoulders, then lower them back down.'
  },
  {
    name: 'Tricep Pushdown',
    category: 'arms',
    equipment: 'cable',
    isCustom: false,
    description: 'Isolation exercise for the triceps.',
    instructions: 'Stand in front of a cable machine with a bar attachment at chest height, push the bar down by extending your elbows, then return to the starting position.'
  },
  {
    name: 'Hammer Curl',
    category: 'arms',
    equipment: 'dumbbell',
    isCustom: false,
    description: 'Variation of the bicep curl targeting the brachialis muscle.',
    instructions: 'Stand with dumbbells at your sides with a neutral grip (palms facing each other), curl them up toward your shoulders, then lower them back down.'
  },
  {
    name: 'Skull Crusher',
    category: 'arms',
    equipment: 'barbell',
    isCustom: false,
    description: 'Isolation exercise for the triceps.',
    instructions: 'Lie on a bench with a barbell held at arms length above your chest, lower it toward your forehead by bending at the elbows, then extend your arms to return to the starting position.'
  },
  {
    name: 'Preacher Curl',
    category: 'arms',
    equipment: 'barbell',
    isCustom: false,
    description: 'Isolation exercise for the biceps using a preacher bench.',
    instructions: 'Sit at a preacher bench with your arms resting on the pad, hold a barbell with an underhand grip, curl it up, then lower it back down.'
  },

  // Core Exercises
  {
    name: 'Crunch',
    category: 'core',
    equipment: 'bodyweight',
    isCustom: false,
    description: 'Basic exercise for the abdominal muscles.',
    instructions: 'Lie on your back with knees bent, place your hands behind your head, and curl your upper body toward your knees.'
  },
  {
    name: 'Plank',
    category: 'core',
    equipment: 'bodyweight',
    isCustom: false,
    description: 'Isometric exercise for core stability.',
    instructions: 'Start in a push-up position but with your weight on your forearms, hold your body in a straight line from head to heels.'
  },
  {
    name: 'Russian Twist',
    category: 'core',
    equipment: 'bodyweight',
    isCustom: false,
    description: 'Exercise for the obliques.',
    instructions: 'Sit on the floor with knees bent and feet off the ground, twist your torso from side to side.'
  },
  {
    name: 'Leg Raise',
    category: 'core',
    equipment: 'bodyweight',
    isCustom: false,
    description: 'Exercise for the lower abdominals.',
    instructions: 'Lie on your back, place your hands at your sides or under your lower back, and lift your legs up toward the ceiling.'
  },
  {
    name: 'Hanging Knee Raise',
    category: 'core',
    equipment: 'bodyweight',
    isCustom: false,
    description: 'Advanced exercise for the abdominals.',
    instructions: 'Hang from a pull-up bar, bring your knees up toward your chest, then lower them back down.'
  },

  // Cardio Exercises
  {
    name: 'Running',
    category: 'cardio',
    equipment: 'other',
    isCustom: false,
    description: 'Cardiovascular exercise.',
    instructions: 'Run at a steady pace for your desired duration.'
  },
  {
    name: 'Jumping Rope',
    category: 'cardio',
    equipment: 'other',
    isCustom: false,
    description: 'High-intensity cardiovascular exercise.',
    instructions: 'Jump rope at a steady pace, maintaining light landings on the balls of your feet.'
  },
  {
    name: 'Cycling',
    category: 'cardio',
    equipment: 'machine',
    isCustom: false,
    description: 'Low-impact cardiovascular exercise.',
    instructions: 'Cycle at a steady pace with resistance that challenges you but allows you to maintain proper form.'
  },
  {
    name: 'Rowing',
    category: 'cardio',
    equipment: 'machine',
    isCustom: false,
    description: 'Full-body cardiovascular exercise.',
    instructions: 'Sit on a rowing machine, push with your legs, pull with your arms, and lean back slightly at the end of each stroke.'
  },
  {
    name: 'Stair Climbing',
    category: 'cardio',
    equipment: 'machine',
    isCustom: false,
    description: 'Cardiovascular exercise that targets the lower body.',
    instructions: 'Use a stair climber machine, maintain an upright posture, and step at a comfortable pace.'
  }
];

// Additional Workout Utilities

// Calculate estimated one-rep max (1RM) based on weight and reps
export function calculateOneRepMax(weight: number, reps: number): number {
  // Brzycki formula
  return weight * (36 / (37 - reps));
}

// Calculate volume for a specific exercise (weight × reps × sets)
export function calculateVolume(weight: number, reps: number, sets: number): number {
  return weight * reps * sets;
}

// Format weight with unit (kg or lbs)
export function formatWeight(weight: number, unit: 'kg' | 'lbs' = 'lbs'): string {
  return `${weight}${unit}`;
}

// Calculate time under tension (TUT)
export function calculateTimeUnderTension(reps: number, secPerRep: number): number {
  return reps * secPerRep;
}

// Group exercises by category
export function groupExercisesByCategory(exercises: Exercise[]): Record<string, Exercise[]> {
  return exercises.reduce((acc, exercise) => {
    const category = exercise.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);
}

// Create a workout summary
export function createWorkoutSummary(
  exercises: Array<{ name: string; sets: number; reps: number; weight: number }>
): string {
  let summary = '';
  let totalVolume = 0;
  
  exercises.forEach(exercise => {
    const volume = calculateVolume(exercise.weight, exercise.reps, exercise.sets);
    totalVolume += volume;
    summary += `${exercise.name}: ${exercise.sets}×${exercise.reps} @ ${exercise.weight}lbs\n`;
  });
  
  summary += `\nTotal Volume: ${totalVolume}lbs`;
  return summary;
} 