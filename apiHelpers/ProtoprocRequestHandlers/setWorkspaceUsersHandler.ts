import { SetWorkspaceUsersRequest, SetWorkspaceUsersResponse } from "../../src/types/ProtoprocRequest";
import { getMongoClient } from "../getMongoClient";
import getWorkspace, { invalidateWorkspaceCache } from "../getWorkspace";
import { userCanSetWorkspaceUsers } from "../permissions";

const setWorkspaceUsersHandler = async (request: SetWorkspaceUsersRequest, o: {verifiedClientId?: string, verifiedUserId?: string}): Promise<SetWorkspaceUsersResponse> => {
    const {verifiedUserId} = o

    const workspaceId = request.workspaceId

    const client = await getMongoClient()

    const workspace = await getWorkspace(workspaceId, {useCache: false})
    if (!userCanSetWorkspaceUsers(workspace, verifiedUserId)) {
        throw new Error('User does not have permission to set workspace users')
    }

    workspace.users = request.users

    workspace.timestampModified = Date.now() / 1000

    const workspacesCollection = client.db('protoproc').collection('workspaces')

    await workspacesCollection.updateOne({workspaceId}, {$set: workspace})

    invalidateWorkspaceCache(workspaceId)

    return {
        type: 'setWorkspaceUsers'
    }
}

export default setWorkspaceUsersHandler