import axios from "axios";

export const PortalRestService = {
    service,
    recordsService,
    Status: {
        NOT_FOUND: 'not-found',
        SUCCESS: 'success',
        VALIDATEION_FAILURE: 'validation-failure',
        ERROR: 'error'
    }
};
const API_CONTEXT = '/o/portal-services';
var axiosInstance = axios.create({
    baseURL: `${API_CONTEXT}`,
    timeout: 10000,
});

function service(request, method, url, callback,
                 {responseConverter, notFoundOK} = {notFoundOK: false}) {

    axiosInstance(
        {
            "method": method,
            "url": url + '?p_auth=' + Liferay.authToken,
            "data": request
        }
    ).then(response => response.data)
        .then((data) => {
            let response;

            // assume an empty response is OK if 2xx response code
            if (!data.hasOwnProperty('success') || data.success) {
                response = {
                    status: "success",
                    result: data,
                    // records: data.results
                };
            } else {
                response = {
                    status: "error",
                };

                if (data.message) {
                    response.message = data.message;
                }
            }

            if (responseConverter) {
                let uResponse = responseConverter(response, data);
                if (uResponse) {
                    response = uResponse;
                }
            }

            callback(response);
        })
        .catch((error) => {
                let response = {
                    status: 'error',
                };

                if (error.code === 'ECONNABORTED') {
                    let errorId = 'TXM-001';
                    response.alertMsg = {
                        severity: 'error',
                        message: Liferay.Language.get('alert.unexpected-error'),
                        details: [
                            [Liferay.Language.get('alert.unexpected-error.error-id') + errorId],
                            Liferay.Language.get('alert.unexpected-error.timeout')
                        ]
                    };
                    response.error = {
                        errorId: errorId,
                    };
                    if (error.response) {
                        response.statusCode = error.response.status;
                    }
                } else if (error.response) {
                    response.statusCode = error.response.status;

                    if (notFoundOK && response.statusCode === 404) {
                        response.status = 'not-found';
                        response.result = error.response.data;
                        if (responseConverter) {
                            let uResponse = responseConverter(response, error.response.data);
                            if (uResponse) {
                                response = uResponse;
                            }
                        }
                    } else if (response.statusCode === 403) {
                        // user session has timed out or somehow been invalidated - redirect to logout url
                        window.location.href = '/c/portal/logout';
                    } else {
                        response.error = {};

                        if (error.response.data) {
                            let data = error.response.data;

                            if (error.response.status === 400) {
                                response.status = 'validation-failure';
                                response.error.validationErrors = data.validationErrors;
                            } else if (error.response.status === 500) {
                                response.error.errorId = data.errorId
                            }
                        }

                        if (response.status === 'validation-failure'
                            && response.error) {
                            response.alertMsg = {
                                severity: 'warning',
                                message: Liferay.Language.get('alert.validation-failure'),
                                details: response.error ? response.error.validationErrors : null
                            };
                        } else {
                            response.alertMsg = {
                                severity: 'error',
                                message: Liferay.Language.get('alert.unexpected-error'),
                                details: response.error && response.error.errorId
                                    ? [Liferay.Language.get('alert.unexpected-error.error-id') + response.error.errorId]
                                    : null
                            };
                        }

                    }

                }
                callback(response);
            }
        );
}

function recordsService(request, method, url, callback,
                        {notFoundOK} = {notFoundOK: false}) {
    service(request, method, url, callback,
        {
            responseConverter: (response, data) => {response.records = data.results; return response; },
            notFoundOK: notFoundOK
        });
}
