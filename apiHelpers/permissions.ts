import { ProtoprocWorkspace } from "../src/types/protoproc-types"
import getWorkspaceRole from './getWorkspaceRole'

export const userCanCreateProject = (workspace: ProtoprocWorkspace, userId: string | undefined): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor'))
}

export const userCanCreateWorkspace = (userId: string | undefined): boolean => {
    if (userId) {
        return true
    }
    return false
}

export const userCanDeleteProject = (workspace: ProtoprocWorkspace, userId: string | undefined): boolean => {
    if (!userId) return false
    const workspaceRole = getWorkspaceRole(workspace, userId)
    if (workspaceRole === 'admin' || workspaceRole === 'editor') {
        return true
    }
    return false
}

export const userCanDeleteWorkspace = (workspace: ProtoprocWorkspace, userId: string | undefined): boolean => {
    if (!userId) {
        return false
    }
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return workspaceRole === 'admin'
}

export const userCanReadWorkspace = (workspace: ProtoprocWorkspace, userId: string | undefined, clientId: string | undefined): boolean => {
    if (clientId) {
        const computeResourceId = workspace.computeResourceId || process.env.VITE_DEFAULT_COMPUTE_RESOURCE_ID
        if ((computeResourceId) && (computeResourceId === clientId)) {
            return true
        }
    }
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor' || workspaceRole === 'viewer'))
}

export const userCanSetFile = (workspace: ProtoprocWorkspace, userId: string | undefined, clientId: string | undefined): boolean => {
    if (clientId) {
        const computeResourceId = workspace.computeResourceId || process.env.VITE_DEFAULT_COMPUTE_RESOURCE_ID
        if ((computeResourceId) && (computeResourceId === clientId)) {
            return true
        }
    }
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor'))
}

export const userCanDeleteFile = (workspace: ProtoprocWorkspace, userId: string | undefined, clientId: string | undefined): boolean => {
    if (!userId) {
        // anonymous cannot delete
        return false
    }
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor'))
}

export const userCanSetWorkspaceProperty = (workspace: ProtoprocWorkspace, userId: string | undefined): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return (workspaceRole === 'admin')
}

export const userCanSetWorkspaceUsers = (workspace: ProtoprocWorkspace, userId: string | undefined): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return (workspaceRole === 'admin')
}

export const userCanSetProjectProperty = (workspace: ProtoprocWorkspace, userId: string | undefined, property: string): boolean => {
    const workspaceRole = getWorkspaceRole(workspace, userId)
    return ((workspaceRole === 'admin' || workspaceRole === 'editor'))
}