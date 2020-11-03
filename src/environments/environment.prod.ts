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

import {AuthConfig} from 'angular-oauth2-oidc';

export const environment = {
    production: true
};

export const TIMESHEETS_REST_URL = '/rest/';
export const REDIRECT_URL = 'https://www.google.ie';

export const OIDC_AUTH_CLIENT_ID = '714812020196-e7jruo2d8ca73fhe6h1j4aqeaaa3ac1s.apps.googleusercontent.com';
export const OIDC_AUTH_SECRET = 'jVBA_holXRjGt_uHljCD2BNu';
export const OIDC_ISSUER = 'https://accounts.google.com';

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
    strictDiscoveryDocumentValidation: false
};
