/*
 * Copyright 2019-present Open Networking Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {AuthConfig} from 'angular-oauth2-oidc';

export const environment = {
    production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */

export const TIMESHEETS_REST_URL = 'http://localhost:3000';

export const OIDC_AUTH_CLIENT_ID = undefined;
export const OIDC_AUTH_SECRET = undefined;
export const OIDC_ISSUER = undefined;

export const authConfig: AuthConfig = {
    issuer: OIDC_ISSUER,
    redirectUri: window.location.origin,
    clientId: OIDC_AUTH_CLIENT_ID,
    responseType: 'code',
    requireHttps: true,
    scope: 'openid profile email',
    dummyClientSecret: OIDC_AUTH_SECRET,
    showDebugInformation: false,
    timeoutFactor: 0.01,
    strictDiscoveryDocumentValidation: true
};
