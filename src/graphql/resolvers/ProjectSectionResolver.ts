import { ResolverService } from "@tsed/graphql";
import { ProjectSectionsService } from "../../services/projectSections/ProjectSectionsService";
import { ProjectSection } from "../../models/projectSections/ProjectSection";
import { Query, Args, Field, ArgsType, ID, Int, Mutation, Arg, InputType } from "type-graphql";
import { ActiveStatus } from "../../enums/ActiveStatus";
import { IProjectSectionQueryParams } from "../../interfaces/ProjectSection/ProjectSectionQueryParams.interface";
import { PageSizes } from "../../enums/PageSizes";

// ArgTypes
@ArgsType()
class GetProjectSectionsArgs implements IProjectSectionQueryParams {
    @Field(() => ID)
    projectId: string;

    @Field(() => ActiveStatus, { defaultValue: ActiveStatus.ACTIVE })
    active: ActiveStatus;

    @Field(() => PageSizes, { defaultValue: PageSizes.TWENTY })
    pageSize: PageSizes;

    @Field(() => Int, { defaultValue: 0 })
    page = 0;
}

@ArgsType()
class GetProjectSectionArgs {
    @Field(() => ID)
    projectSectionId: string;
}

// InputTypes
@InputType({ description: "ProjectSection generic input" })
class ProjectSectionInput implements Partial<ProjectSection> {
    @Field(() => ID, { nullable: true })
    _id: string;

    @Field(() => ID)
    projectId: string;

    @Field(() => String)
    projectSectionName: string;

    @Field(() => ActiveStatus, { defaultValue: ActiveStatus.ACTIVE })
    active: ActiveStatus;
}

@InputType({ description: "Add ProjectSection data" })
class AddProjectSectionInput extends ProjectSectionInput implements Partial<ProjectSection> {}

@InputType({ description: "Edit ProjectSection data" })
class PatchProjectSectionInput extends ProjectSectionInput implements Partial<ProjectSection> {
    @Field(() => ID)
    _id: string;

    @Field(() => String, { nullable: true })
    projectId: string;

    @Field(() => String, { nullable: true })
    projectSectionName: string;
}

// Resolver
@ResolverService(ProjectSection)
export class ProjectSectionResolver {
    constructor(private projectSectionsService: ProjectSectionsService) {}

    @Query(() => ProjectSection)
    async projectSection(@Args() { projectSectionId }: GetProjectSectionArgs): Promise<ProjectSection> {
        return await this.projectSectionsService.findProjectSectionById(projectSectionId);
    }

    @Query(() => [ProjectSection])
    async projectSections(@Args() projectSectionArgs: GetProjectSectionsArgs): Promise<ProjectSection[]> {
        return await this.projectSectionsService.findProjectSectionsByProjectId(
            projectSectionArgs.projectId,
            projectSectionArgs
        );
    }

    @Mutation(() => ProjectSection)
    async addProjectSection(@Arg("data") projectSection: AddProjectSectionInput): Promise<ProjectSection> {
        return this.projectSectionsService.addProjectSection(projectSection);
    }

    @Mutation(() => ProjectSection)
    async patchProjectSection(@Arg("data") projectSection: PatchProjectSectionInput): Promise<ProjectSection> {
        return this.projectSectionsService.updateProjectSection(projectSection?._id, projectSection);
    }

    @Mutation(() => Boolean)
    async removeProjectSection(@Arg("projectSectionId") projectSectionId: string): Promise<boolean> {
        return this.projectSectionsService.removeProjectSection(projectSectionId);
    }
}
