import { TeamMember } from '@/types'
import { ASSETS } from '../constants'



export const team: TeamMember[] = [
  { initials: 'T1', name: 'Team Member', role: 'Brand Designer',    badge: 'Designer', image: undefined },
  { initials: 'T2', name: 'Yousef Hamdan',   role: 'Full-Stack Dev',    badge: 'Dev',      image: ASSETS.fullStackDev },
  { initials: 'T3', name: 'Team Member', role: 'Motion Designer',   badge: 'Motion',   image: undefined },
  { initials: 'T4', name: 'Team Member', role: 'Systems Engineer',  badge: 'Systems',  image: undefined },
  { initials: 'T5', name: 'Team Member', role: 'Game Developer',    badge: 'Game Dev', image: undefined },
  { initials: 'T6', name: 'Team Member', role: 'Creative Director', badge: 'Creative', image: undefined },
]