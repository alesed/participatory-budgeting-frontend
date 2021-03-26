import { PageSortingEnum } from 'src/app/shared/types/shared.types';
import { ResultProject } from '../types/result.types';

export function sortProjectsByVotes(
  projects: ResultProject[],
  sortType: PageSortingEnum.VOTES_ASC | PageSortingEnum.VOTES_DESC
): ResultProject[] {
  let sortedProjects: ResultProject[];
  if (sortType === PageSortingEnum.VOTES_ASC) {
    sortedProjects = projects.sort(
      (a, b) => a.number_of_votes - b.number_of_votes
    );
  } else {
    sortedProjects = projects.sort(
      (a, b) => b.number_of_votes - a.number_of_votes
    );
  }
  return [...sortedProjects];
}

export function sortProjectsByName(
  projects: ResultProject[],
  sortType: PageSortingEnum.NAME_ASC | PageSortingEnum.NAME_DESC
): ResultProject[] {
  let sortedProjects: ResultProject[];
  if (sortType === PageSortingEnum.NAME_DESC) {
    sortedProjects = projects.sort((a, b) =>
      a.project_name.localeCompare(b.project_name)
    );
  } else {
    sortedProjects = projects.sort((a, b) =>
      b.project_name.localeCompare(a.project_name)
    );
  }
  return [...sortedProjects];
}
