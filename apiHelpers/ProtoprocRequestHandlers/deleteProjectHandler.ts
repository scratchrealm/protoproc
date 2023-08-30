import { DeleteProjectRequest, DeleteProjectResponse } from "../../src/types/ProtoprocRequest";
import getProject from "../getProject";
import { getMongoClient } from "../getMongoClient";
import getWorkspace from "../getWorkspace";
import { userCanDeleteProject } from "../permissions";

const deleteProjectHandler = async (request: DeleteProjectRequest, o: {verifiedClientId?: string, verifiedUserId?: string}): Promise<DeleteProjectResponse> => {
    const {verifiedUserId} = o

    const client = await getMongoClient()

    const workspace = await getWorkspace(request.workspaceId, {useCache: false})
    if (!userCanDeleteProject(workspace, verifiedUserId)) {
        throw new Error('User does not have permission to delete an projects in this workspace')
    }

    const project = await getProject(request.projectId, {useCache: false})
    if (project.workspaceId !== request.workspaceId) {
        throw new Error('Incorrect workspace ID')
    }

    const filesCollection = client.db('protoproc').collection('files')
    filesCollection.deleteMany({projectId: request.projectId})

    const dataBlobsCollection = client.db('protoproc').collection('dataBlobs')
    dataBlobsCollection.deleteMany({projectId: request.projectId})

    const jobsCollection = client.db('protoproc').collection('jobs')
    jobsCollection.deleteMany({projectId: request.projectId})

    const projectsCollection = client.db('protoproc').collection('projects')

    await projectsCollection.deleteOne({projectId: request.projectId})

    const workspacesCollection = client.db('protoproc').collection('workspaces')
    await workspacesCollection.updateOne({workspaceId: request.workspaceId}, {$set: {timestampModified: Date.now() / 1000}})

    return {
        type: 'deleteProject'
    }
}

export default deleteProjectHandler