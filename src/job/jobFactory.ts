import { IDBConnector } from "../services/db";
import {ICDNConnector } from "../services/cdn"
import { ProductionJobHandler } from "./productionJobHandler";
import { RegressionJobHandler } from "./regressionJobHandler";
import { StagingJobHandler } from "./stagingJobHandler";
import { IRepoConnector } from "../services/repo";
import { ILogger } from "../services/logger";
import { JobHandler } from "./jobHandler";
import { ICommandExecutor } from "../services/commandExecutor";
import { InvalidJobError } from "../errors/errors";
import { IJob } from "../entities/job";

export class JobFactory {
    public createJobHandler(job: IJob, commandExecutor: ICommandExecutor, dbConnector: IDBConnector, 
        cdnConnector:ICDNConnector, repoConnector:IRepoConnector, logger: ILogger) : JobHandler {
        if (job.payload.jobType === "regression") {
            return new RegressionJobHandler(job, commandExecutor, dbConnector, cdnConnector, repoConnector, logger);
        } else if (job.payload.jobType === "githubPush") {
            return new StagingJobHandler(job, commandExecutor, dbConnector, cdnConnector, repoConnector, logger);
        } else if (job.payload.jobType === "productionDeploy") {
            return new ProductionJobHandler(job, commandExecutor, dbConnector, cdnConnector, repoConnector, logger);
        }
        throw new InvalidJobError("Job type not supported");
    }
}