import { ResolverService } from "@tsed/graphql";
import { Arg, Args, Query, Ctx, ArgsType, Field, InputType, Mutation } from "type-graphql";
import { Project } from "../../models/projects/Project";
import { IsMongoId, IsArray } from "class-validator";
import { ActiveStatus } from "../../enums/ActiveStatus";
import { ProjectsService } from "../../services/projects/ProjectsService";

// ArgTypes
@ArgsType()
class GetProjectsArgs {
    @Field(() => String)
    @IsMongoId()
    companyId: string;

    @Field(() => ActiveStatus, { defaultValue: ActiveStatus.ACTIVE })
    active?: ActiveStatus;
}

// InputTypes
@InputType({ description: "Add Project data" })
class AddProjectInput implements Partial<Project> {
    @Field(() => String)
    @IsMongoId()
    company: string;

    @Field(() => String)
    projectName: string;

    @Field(() => [String], { nullable: true })
    @IsArray()
    projectSections?: string[];

    @Field(() => String)
    @IsMongoId()
    projectType: string;

    @Field(() => ActiveStatus, { defaultValue: ActiveStatus.ACTIVE })
    active?: ActiveStatus;
}

@InputType({ description: "Update Project data" })
class UpdateProjectInput extends AddProjectInput implements Partial<Project> {
    @Field(() => String)
    @IsMongoId()
    _id: string;
}

@InputType({ description: "Update Project data" })
class PatchProjectInput implements Partial<Project> {
    @Field(() => String)
    @IsMongoId()
    _id: string;

    @Field(() => String, { nullable: true })
    projectName?: string;

    @Field(() => [String], { nullable: true })
    @IsArray()
    projectSections?: string[];

    @Field(() => String, { nullable: true })
    @IsMongoId()
    projectType: string;

    @Field(() => ActiveStatus, { nullable: true })
    active?: ActiveStatus;
}

// Resolver
@ResolverService(Project)
export class ProjectResolver {
    constructor(private projectsService: ProjectsService) {}

    // Queries
    @Query(() => [Project])
    async projects(@Args() { companyId, active }: GetProjectsArgs): Promise<Project[]> {
        return await this.projectsService.findByCompanyId(companyId, active);
    }

    @Query(() => Project)
    async project(@Arg("_id") id: string): Promise<Project> {
        return await this.projectsService.findProjectById(id);
    }

    // Mutations
    @Mutation(() => Project)
    async addProject(@Arg("data") project: AddProjectInput): Promise<Project> {
        return await this.projectsService.addProject(project);
    }

    // Mutations
    @Mutation(() => Project)
    async updateProject(@Arg("data") project: UpdateProjectInput): Promise<Project> {
        return await this.projectsService.updateProject(project._id, project);
    }

    @Mutation(() => Project)
    async patchProject(@Arg("data") project: PatchProjectInput): Promise<Project> {
        return await this.projectsService.patchProject(project._id, project);
    }

    @Mutation(() => Project)
    async removeProject(@Arg("_id") id: string): Promise<Project> {
        return await this.projectsService.removeProject(id);
    }
}
