import * as apiConfig from "../../helpers/apiConfig";

export async function searchUsers(query = "", start, count, sort, order) {
    const url = new URL(apiConfig.APIURL + `/search/users`);
    url.search = new URLSearchParams({
        q: query,
        ...(start !== undefined && start),
        ...(count !== undefined && count),
        ...(sort !== undefined && sort),
        ...(order !== undefined && order),
    });

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit()
    });

    return response;
}

export async function searchCompetencies(query = "", start, count, sort, order) {
    const url = new URL(apiConfig.APIURL + `/search/competencies`);
    url.search = new URLSearchParams({
        q: query,
        ...(start !== undefined && start),
        ...(count !== undefined && count),
        ...(sort !== undefined && sort),
        ...(order !== undefined && order),
    });

    const response = await fetch(url, {
        ...apiConfig.getDefaultRequestInit()
    });

    return response;
}
