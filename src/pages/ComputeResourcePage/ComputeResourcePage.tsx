import { FunctionComponent, useEffect, useMemo, useState } from "react";
import ComputeResourceIdComponent from "../../ComputeResourceIdComponent";
import { fetchComputeResource, fetchJobsForComputeResource } from "../../dbInterface/dbInterface";
import { useGithubAuth } from "../../GithubAuth/useGithubAuth";
import { timeAgoString } from "../../timeStrings";
import { ProtoprocComputeResource, ProtoprocJob } from "../../types/protoproc-types";
import UserIdComponent from "../../UserIdComponent";
import JobsTable from "../ProjectPage/JobsWindow/JobsTable";
import ComputeResourceJobsTable from "./ComputeResourceJobsTable";

type Props = {
    width: number
    height: number
    computeResourceId: string
}

const ComputeResourcesPage: FunctionComponent<Props> = ({width, height, computeResourceId}) => {
    const [computeResource, setComputeResources] = useState<ProtoprocComputeResource>()

    const {accessToken, userId} = useGithubAuth()
    const auth = useMemo(() => (accessToken ? {githubAccessToken: accessToken, userId} : {}), [accessToken, userId])

    useEffect(() => {
        let canceled = false
        ;(async () => {
            const cr = await fetchComputeResource(computeResourceId, auth)
            if (canceled) return
            setComputeResources(cr)
        })()
        return () => {canceled = true}
    }, [computeResourceId, auth])

    const [jobs, setJobs] = useState<ProtoprocJob[] | undefined>()

    useEffect(() => {
        (async () => {
            const sj = await fetchJobsForComputeResource(computeResourceId, auth)
            setJobs(sj)
        })()
    }, [computeResourceId, auth])

    const sortedJobs = useMemo(() => {
        return jobs ? [...jobs].sort((a, b) => (b.timestampCreated - a.timestampCreated))
            .sort((a, b) => {
                const statuses = ['running', 'pending', 'failed', 'completed']
                return statuses.indexOf(a.status) - statuses.indexOf(b.status)
            }) : undefined
    }, [jobs])

    return (
        <div style={{padding: 20}}>
            <h3>
                Compute resource: {computeResource?.name}
            </h3>
            <hr />
            <table className="table1" style={{maxWidth: 550}}>
                <tbody>
                    <tr>
                        <td>Compute resource name</td>
                        <td>{computeResource?.name}</td>
                    </tr>
                    <tr>
                        <td>Compute resource ID</td>
                        <td><ComputeResourceIdComponent computeResourceId={computeResourceId} /></td>
                    </tr>
                    <tr>
                        <td>Owner</td>
                        <td><UserIdComponent userId={computeResource?.ownerId || ''} /></td>
                    </tr>
                    <tr>
                        <td>Created</td>
                        <td>{timeAgoString(computeResource?.timestampCreated)}</td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <p>Full ID: {computeResource?.computeResourceId}</p>
            <hr />
            <JobsTable
                width={width}
                height={height}
                jobs={sortedJobs}
                fileName={""}
                onJobClicked={() => {}}
            />
        </div>
    )
}

export default ComputeResourcesPage