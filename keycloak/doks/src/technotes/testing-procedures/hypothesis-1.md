# Hypothesis 1: Easy Street
![Placeholder - Everything Works Great](https://via.placeholder.com/780x300)   


## Initial Assumptions
Currently the GeoPlatform "Legacy Stack", has the following connected/distributed URLs, and thereby the most likely authorization workflow:

### Inventory of Related Domains
1. geoplatform.gov
2. accounts.geoplatform.gov
3. sp.geoplatform.gov
4. idp.geoplatform.gov
5. idm.geoplatform.gov

## Predicted Authorization Workflow
* **Step 1**, user requests login access to perform any associated function while on the [GeoPlatform website](https://www.geoplatform.gov)
* **Step 2**, user is redirected for login to [accounts.geoplatform.gov](https://accounts.geoplatform.gov) which is likely passed as some sort of reference by a view with the name say "login" or soemthing like that, so the original request might be served from [geoplatform.gov/login](https://geoplatform.gov/login).
* **Step 3**, user's authentication is taken in the form of a username & password by the service provider _[sp.geoplatform.gov](https://sp.geoplatform.gov)_, and then permissions are delegated by either a group or role via the identity provider _[idp.geoplatform.gov](https://idp.geoplatform.gov)_ **+**
* **Step 4**, upon successful authentication, users' session or cookie information, with a Basic Authentication or JSON Web Token (JWT) header, is sent as a packaged request to the identity provider, which then relegates what activities the authenticated user has authorization to access/edit/manage/etc. **+**
* **Step 5**, if authorized, the user can then manage the identity providers and service providers via their Identity management, [idm.geoplatform.gov](https://idm.geoplatform.gov)

**+**: _Say, for an example case, a user has to 1st sign-in to their account, and then LDAP via Active Directory for example, delegates authorization to certain resources based on that users' role/group within the policy management of that forrest/domain._

## Expected Course of Integration Test
* **Step 1:** spin up a local keycloak instance which will act as the local case for [sit-login.geoplatform.gov](https://sit-login.geoplatform.gov)
* **Step 2:** spin up a local instance of a website similar to the GeoPlatform site, utilizing the SimpleSAML-PHP package [Vanguard SSO](https://sso.vanguards.rocks)
* **Step 3:** create an OAuth key pair within GitHub, that Vanguard SSO can utilize the `client_id` and `client_secret` parameters against
* **Step 4:** create user credentials on the Vanguard SSO side, with basic authentication
* **Step 5:** integrate GitHub OAuth credentials with the Vanguard SSO application
* **Step 6:** create a GitHub identity provider in Keycloak, and create a Vanguard SSO client, whereby the Vanguard SSO is the service providing endpoint and GitHub is the initial provider of authentication
* **Step 7:** integrate Vanguard SSO with GitHub & then do the same with Keycloak
* **Step 8:** initialize the first end-to-end workflow for the user, by accessing the Keycloak landing point, then loggining into Keycloak with GitHub, and then logging into the Vanguard SSO application with that successful authorization from Keycloak _(scope matching where needed)_
* **Step 9:** review data passed and mapped over across all applications and workflow instances, and then document the proposal of their crossovers in the real/dev environment for the GeoPlatform Legacy transition/migration.
* **Step 10/BONUS:** setup authentication with ArcGIS in the Vanguard SSO application with GeoPlatform.gov as the relegator of authentication

<span class="emphasis">**Results of Integration Test: Success!**</span>

_To review more detailed information regarding integratio test a, including the instructions on how to setup your own instance, [please visit the detailed procedure review](./config/instructions-for-test-1a)._

<span class="emphasis-warning">**!ALERT**</span>      
> If we had a successful integration test, what was the problem? Why have we marked this hypothesis as failed?

Unfortunately, the integration test itself was performed 1st, because the developer already familiar with Keycloak, wanted to test and see if the integration itself, from the Keycloak side of things, would cause any issues, before choosing to tackle the legitimate legacy environment. You normally want to avoid testing against production as much as possible, even if you aren't touching data.

Ultimately this led to a false positive, or a false sense of confidence that the current GeoPlatform Legacy setup, should be able to integrate with Keycloak serving as the IdP without many problems at all. Once the testing to confirm the traceroute for the current GeoPlatform authentication traceroute was performed, the sad truth was highlighted that this would be anything but easy street. You can see more about those details in our [final findings write-up for hypothesis #1.](../../findings/findings-hypothesis-1)

