This project currently acts as a layer between the old web services via soap 1.1 to the Campaign Commander data for campaigns.
In VS2012 we are unable to add a service reference to the Campaign Commander service,
and if we make soap calls straight from javascript then it becomes unmanagable because of the excessive inline xml strings.

Ultimately this will be replaced with direct javascript calls, or the service could be updated and replaced with a modern Restful web service.

VS2005 was used to create an assembly that had the web service wrapped in it. This assembly was then compiled and referenced directly
from this project. "ccsoap". This gives good enough raw access to the service calls.
