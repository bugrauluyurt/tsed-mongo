import { Service } from "@tsed/common";
import { MongooseModel } from "../../types/MongooseModel";
import { MilestoneModel, Milestone } from "../../models/milestones/Milestone";
import { BadRequest } from "ts-httpexceptions";
import { ERROR_MILESTONE_ID_MISSING, ERROR_MILESTONE_QUERY_PARAM_MISSING } from "../../errors/MilestonesError";
import { sanitizeModelBody } from "../../../utils/sanitizeUpdateBody";
import * as _ from "lodash";
import { MilestonesQueryParams } from "../../models/milestones/MilestoneQueryParams";
import { getModelSafeData } from "../../../utils/getModelSafeData";
import { getSafeFindQueryConditions } from "../../../utils/getSafeFindQueryConditions";

@Service()
export class MilestonesService {
    private Milestone: MongooseModel<Milestone>;

    constructor() {
        this.Milestone = MilestoneModel as MongooseModel<Milestone>;
    }

    async getMilestone(milestoneId: string): Promise<Milestone> {
        if (!milestoneId) {
            throw new BadRequest(ERROR_MILESTONE_ID_MISSING);
        }
        return await this.Milestone.findById(milestoneId).exec();
    }

    async getMilestones(queryParams: object = {}): Promise<Milestone[]> {
        const { modelSafeData } = getModelSafeData<MilestonesQueryParams>(queryParams, new MilestonesQueryParams());
        if (!modelSafeData?.projectSection && _.isEmpty(modelSafeData?.milestoneIds)) {
            throw new BadRequest(ERROR_MILESTONE_QUERY_PARAM_MISSING);
        }
        return await this.Milestone.find(
            getSafeFindQueryConditions<MilestonesQueryParams>(modelSafeData, [
                ["_id", "milestoneIds"],
                ["projectSection"],
            ])
        ).exec();
    }

    async addMilestone(milestone: Milestone): Promise<Milestone> {
        const model = new this.Milestone(sanitizeModelBody<Milestone>(milestone));
        return await this.Milestone.create(model);
    }

    async updateMilestone(milestoneId: string, milestonePartial: Partial<Milestone>): Promise<Milestone> {
        if (_.isEmpty(milestoneId)) {
            throw new BadRequest(ERROR_MILESTONE_ID_MISSING);
        }
        return await this.Milestone.findByIdAndUpdate(milestoneId, milestonePartial, {
            omitUndefined: true,
            new: true,
            runValidators: true,
        }).exec();
    }

    async removeMilestone(milestoneId: string): Promise<Milestone> {
        if (_.isEmpty(milestoneId)) {
            throw new BadRequest(ERROR_MILESTONE_ID_MISSING);
        }
        return await this.Milestone.findByIdAndDelete(milestoneId).exec();
    }
}
