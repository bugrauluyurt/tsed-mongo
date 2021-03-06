import { Service } from "@tsed/common";
import { MongooseModel } from "../../types/MongooseModel";
import { BadRequest } from "ts-httpexceptions";
import * as _ from "lodash";
import * as mongoose from "mongoose";
import { MilestoneStatus, MilestoneStatusModel } from "../../models/milestoneStatuses/MilestoneStatus";
import { ERROR_MILESTONE_STATUS_ID_MISSING } from "../../errors/MilestoneStatusError";
import { MilestoneStatusUtils } from "../../models/milestoneStatuses/MilestoneStatus.utils";
import { isValidMongoId } from "../../utils/isValidMongoId";

@Service()
export class MilestoneStatusesService {
    private MilestoneStatus: MongooseModel<MilestoneStatus>;

    constructor() {
        this.MilestoneStatus = MilestoneStatusModel as MongooseModel<MilestoneStatus>;
    }

    async findMilestoneStatus(milestoneStatusIds?: string, milestoneStatusName?: string): Promise<MilestoneStatus[]> {
        const ids = _.split(milestoneStatusIds, ",");
        const condition = _.reduce(
            ids || [],
            (acc, id) => {
                if (isValidMongoId(id)) {
                    if (!acc["_id"]) {
                        acc["_id"] = [];
                    }
                    acc["_id"].push(mongoose.Types.ObjectId(id));
                }
                return acc;
            },
            {}
        );
        if (!_.isEmpty(milestoneStatusName)) {
            condition["name"] = milestoneStatusName;
        }
        return await this.MilestoneStatus.find(condition).limit(_.keys(MilestoneStatusUtils.STATUS).length).exec();
    }

    async findMilestoneStatusById(milestoneStatusId: string): Promise<MilestoneStatus> {
        if (!isValidMongoId(milestoneStatusId)) {
            throw new BadRequest(ERROR_MILESTONE_STATUS_ID_MISSING);
        }
        return await this.MilestoneStatus.findById(milestoneStatusId).exec();
    }
}
