Troubleshooting guide:

Invite link redirects to localhost:3000 unexpectedly:

Likely causes:
-	Somewhere in front egg redirect URL is set to http://localhost:3000 
-	The app itself forces a redirect
-	Email template might have a redirect URL that  set to http://localhost:3000

How to diagnose and fix:
-	Hover over the invite link look for the host – should be your frontegg tenant domain – if it is correct move to the next bullet
-	Check your app URL in frontegg’s dashboard (applications – click on your application) and make sure it carries the correct redirect URL

Users page is missing from the admin portal:
Likely causes:
-	Users section is disabled in the admin portal builder
-	The logged in user has a role that does not have permission to view the portal

How to diagnose and fix:
-	In frontegg admin portal builder make sure the users section is turned on
-	Check the role of the current user, and make sure that this role has the permission: fe.secure.read.users

Invite user button doesn’t appear after the users page shows up:
Likely causes: 
-	The logged in user does not have enough permissions to invite other users

How to diagnose and fix:
-	Check the role of the current user, and make sure that this role has the permissions: fe.secure.read.users, fe.secure.write.users, fe.secure.write.tenant.invites

Google login is not available in the login screen:
Likely cause:
-	Google login is disabled in the login box builder

Solution:
-	Open the login box builder and activate google login.

401 error in login:
Likely causes and fixes: 
-	Wrong URL – make sure that the URL in your app matches the URL in your frontegg dashboard keys&domains section
-	Redirect URL is not setup correctly – Make sure that your redirect URL is setup correctly in the hosted login section of the frontegg dashboard.
-	Token request blocked - Make sure your redirect URL is listed in allowed origins under keys&domains in the frontegg dashboard .
-	Third party cookies blocked – Allow 3rd party cookies in your browser. Remove any blockers.
-	URL typo (http vs https etc)

Refresh token VS Access token:
Access token – used by frontend to call APIs for protected APIs
Refresh token – Managed by the frontegg client (SDK) that handles silent refresh automatically as long as the session is working. 

a 401 error can show up in the logs when the refresh token refreshes as this is a method for the SDK to check if the user is logged in or not.

User active tenant change via API:

Step 1: Get a bearer token:
curl --location --request POST 'https://api.frontegg.com/auth/vendor' \
--header 'Content-Type: application/json' \
--header 'Cookie: _cfuvid=BhSjzTN_zNKI7cSztZji0MR8YtgEai5poMx1nVfi5Do-1757258643937-0.0.1.1-604800000' \
--data-raw '{
    "clientId": "XXX",
    "secret": "XXX"
  }'

Step 2: Send the request:
curl --location --request PUT 'https://api.frontegg.com/identity/resources/users/v1/tenant' \
--header 'Content-Type: application/json' \
--header 'frontegg-user-id: 3b843b86-51ea-41b2-aefa-1ee0c208a151' \
--header 'frontegg-tenant-id: f97d2b91-4b67-4fcf-b32f-f2e1797eb5ac' \
--header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsInRva2VuSXNzdWVyIjoiZnJvbnRlZ2cifQ.eyJzY29wZXMiOltdLCJ0eXBlIjoidmVuZG9yIiwidmVuZG9ySWQiOiI4YTgxOGY0NC01ZmQ1LTRmMTktODZjMi05ZmYxMThjNmM1Y2UiLCJpYXQiOjE3NTcyNTg2NDMsImV4cCI6MTc1NzM0NTA0M30.fBYkz07l1TMNNLleWEI83aRNhdcUr75TWSXerWm0G7yqteBiSw9jdthzIWBonKqwGY55SEEQMK2wZbLZkyHQx132DSxwbd5rziKBIy12gI1CYnvQR3PdElR8DWWjoLUHBVMwrR0YKeKE3yDl10RG35sI2qILxGWUu223eGUsKGbwcBbIcYXJG2T4kH3eIBsfkQuIX_EW_UzkPmPRqM2U9U9-BlBti7PdePQ9PlcNY3tfOoeYYo561OEfIw7r8IcfPtKXtPCRobGZLfp1l-dAM_L9FzCOt9WTbC8sNrvVG6dcRPgSIGrJ2XLUNmpQJqvuljBihfjRGgf_g1DIxksquQ' \
--header 'Cookie: _cfuvid=BhSjzTN_zNKI7cSztZji0MR8YtgEai5poMx1nVfi5Do-1757258643937-0.0.1.1-604800000' \
--data-raw '{"tenantId":"4b44b404-b192-4c5e-8144-2ae3060e6924"}'

I would use this in support to debug users issue, fix mis assignment to tenants, account recovery – if a user deleted himself from tenant by mistake

Part D: 
1

Dear Mr Mecrury,
Lately we have encountered an issue where our users page does not open in the admin portal across all applications in our customers portfolio, blocking users invite button from being functional and users visibility across all users levels.

I would like to inform you that our R&D are working on this with the highest priority, and we are expected to get an ETA for final fix deployment in the next 24 hours.

In the meantime, you can monitor your users list and invite new users from your dashboard.
If you have embedded an invite API in any of your apps it is working and no impact is expected there.

I am sorry for the inconvenience and I expect to update you within the next 24 hours on our progress.


2
1. Confirm the tenant baseUrl
•	Open wherever FronteggProvider is configured
•	Ensure the redirect matches your tenant subdomain (e.g., https://app-xxxx.frontegg.com).
•	Wrong environment (Dev vs Prod) will always cause a 401.
2. Check Redirect URLs in Frontegg Portal
•	Go to Authentication → Login method → Hosted login.
•	Confirm or your deployed URL) is listed in Redirect URLs.
•	Must match exactly (protocol, host, port)
3. Check Allowed Origins (CORS)
•	Go to Keys & domains → Domains.
•	Add your app origin
•	Missing origin = browser blocks token exchange → 401.
4. Inspect the failing network call
•	In Chrome DevTools → Network tab after login redirect.
•	Look for POST /oauth/token or authorize request.
•	Click it and read the response JSON — it often says invalid_client, invalid_grant, etc.
•	That message tells you what went wrong.
5. Confirm query parameters weren’t stripped
•	After redirect, the URL should contain ?code=...&state=... (or session_state).
•	If missing, your app cleared them too early or router reloaded.
•	Ensure requestAuthorize() runs before you replaceState or clean the URL.
7. Test in Incognito without extensions
•	Try the login flow in an Incognito window with no extensions.
•	If it works there, ad-blockers or privacy extensions are interfering.
8. Double-check environment (Dev vs Prod)
•	In Frontegg portal, top-left environment selector.
•	Ensure you’re editing the same environment (baseUrl from your app).
•	Common mistake: app points to Dev, but you configured Prod.
9. Check time sync on machine
•	If the system clock is off by minutes, JWT validation can fail with 401.
•	Sync your system clock with NTP.

-	For production incident: Senior team member to investigate quickly, escalate to R&D if needed, and report with results within 2 hours
-	Three enterprise tickets: I want to get status report for each one of them, according to their complexity I will send them to my team members. I will make sure the entire team is aware of these tickets and that they are handled in all time zones.
-	Feature request: I will make sure the definitions of the feature are clear, and that R&D are aware of the urgency. I will try to get an ETA and update sales
-	I will update my manager to make sure he is aware of the workload on the team and ask for his help with pushing things with R&D/Devops when needed

