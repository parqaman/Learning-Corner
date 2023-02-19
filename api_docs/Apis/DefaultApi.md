# DefaultApi

All URIs are relative to *http://localhost:4000*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteCoursesCourseIDUsersUserID**](DefaultApi.md#deleteCoursesCourseIDUsersUserID) | **DELETE** /courses/{id} | delete a course by only course creator |
| [**deleteGroup**](DefaultApi.md#deleteGroup) | **DELETE** /groups/{id} | delete a group |
| [**deleteSectionCourse**](DefaultApi.md#deleteSectionCourse) | **DELETE** /courses/{courseId}/section/{sectionId} |  |
| [**deleteSectionGroup**](DefaultApi.md#deleteSectionGroup) | **DELETE** /groups/{groupId}/section/{sectionId} |  |
| [**deleteUsersId**](DefaultApi.md#deleteUsersId) | **DELETE** /users/{id} |  |
| [**deleteUsersUserIDCourseCourseID**](DefaultApi.md#deleteUsersUserIDCourseCourseID) | **DELETE** /users/{userID}/course/{courseID} |  |
| [**deleteUsersUseridCourseCourseidGroupGroupid**](DefaultApi.md#deleteUsersUseridCourseCourseidGroupGroupid) | **DELETE** /users/{userid}/course/{courseid}/group/{groupid} |  |
| [**getCourseMessage**](DefaultApi.md#getCourseMessage) | **GET** /courses/{id}/message | Your GET endpoint |
| [**getCourses**](DefaultApi.md#getCourses) | **GET** /courses |  |
| [**getCoursesId**](DefaultApi.md#getCoursesId) | **GET** /courses/{id} |  |
| [**getGroupId**](DefaultApi.md#getGroupId) | **GET** /groups/{id} |  |
| [**getGroupMessage**](DefaultApi.md#getGroupMessage) | **GET** /groups/{id}/message | Your GET endpoint |
| [**getUserFavoriteCourses**](DefaultApi.md#getUserFavoriteCourses) | **GET** /users/{userId}/favorite | get user favorite course list |
| [**getUsers**](DefaultApi.md#getUsers) | **GET** /users |  |
| [**getUsersId**](DefaultApi.md#getUsersId) | **GET** /users/{id} |  |
| [**getUsersUseridGroups**](DefaultApi.md#getUsersUseridGroups) | **GET** /users/{userid}/groups | Your GET endpoint |
| [**postAuthLogin**](DefaultApi.md#postAuthLogin) | **POST** /auth/login |  |
| [**postAuthRegister**](DefaultApi.md#postAuthRegister) | **POST** /auth/register |  |
| [**postCourses**](DefaultApi.md#postCourses) | **POST** /courses |  |
| [**postGroups**](DefaultApi.md#postGroups) | **POST** /groups | Post group |
| [**postSectionCourse**](DefaultApi.md#postSectionCourse) | **POST** /courses/{id}/section |  |
| [**postSectionFile**](DefaultApi.md#postSectionFile) | **POST** /sections/{sectionId}/file |  |
| [**postSectionGroup**](DefaultApi.md#postSectionGroup) | **POST** /groups/{id}/section |  |
| [**putAuthResetpassword**](DefaultApi.md#putAuthResetpassword) | **PUT** /auth/resetpassword | Update password |
| [**putCourse**](DefaultApi.md#putCourse) | **PUT** /courses/{id} | update a course by only course creator |
| [**putGroup**](DefaultApi.md#putGroup) | **PUT** /groups/{id} | update a group |
| [**putSectionCourse**](DefaultApi.md#putSectionCourse) | **PUT** /courses/{courseId}/section/{sectionId} |  |
| [**putSectionGroup**](DefaultApi.md#putSectionGroup) | **PUT** /groups/{groupId}/section/{sectionId} |  |
| [**putUserFavoriteCourse**](DefaultApi.md#putUserFavoriteCourse) | **PUT** /users/{userId}/course/{courseId}/favorite | put a user favorite course |
| [**putUsersId**](DefaultApi.md#putUsersId) | **PUT** /users/{id} |  |
| [**putUsersUserIDCourseCourseID**](DefaultApi.md#putUsersUserIDCourseCourseID) | **PUT** /users/{userID}/course/{courseID} |  |
| [**putUsersUseridCourseCourseidGroupGroupid**](DefaultApi.md#putUsersUseridCourseCourseidGroupGroupid) | **PUT** /users/{userid}/course/{courseid}/group/{groupid} |  |


<a name="deleteCoursesCourseIDUsersUserID"></a>
# **deleteCoursesCourseIDUsersUserID**
> deleteCoursesCourseIDUsersUserID(id)

delete a course by only course creator

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the course to work with | [default to null] |

### Return type

null (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

<a name="deleteGroup"></a>
# **deleteGroup**
> deleteGroup(id)

delete a group

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the group to work with | [default to null] |

### Return type

null (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="deleteSectionCourse"></a>
# **deleteSectionCourse**
> deleteSectionCourse(courseId, sectionId)



    Delete section in a course

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **courseId** | **UUID**| The id of the course | [default to null] |
| **sectionId** | **UUID**| The id of the section | [default to null] |

### Return type

null (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="deleteSectionGroup"></a>
# **deleteSectionGroup**
> deleteSectionGroup(groupId, sectionId)



    Delete section in a group

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **groupId** | **UUID**| The id of the group | [default to null] |
| **sectionId** | **UUID**| The id of the section | [default to null] |

### Return type

null (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="deleteUsersId"></a>
# **deleteUsersId**
> deleteUsersId(id)



    Delete User

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the user to work with | [default to null] |

### Return type

null (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

<a name="deleteUsersUserIDCourseCourseID"></a>
# **deleteUsersUserIDCourseCourseID**
> deleteUsersUserIDCourseCourseID(userID, courseID)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userID** | **String**|  | [default to null] |
| **courseID** | **String**|  | [default to null] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

<a name="deleteUsersUseridCourseCourseidGroupGroupid"></a>
# **deleteUsersUseridCourseCourseidGroupGroupid**
> deleteUsersUseridCourseCourseidGroupGroupid(userid, courseid, groupid)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userid** | **String**|  | [default to null] |
| **courseid** | **String**|  | [default to null] |
| **groupid** | **String**|  | [default to null] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

<a name="getCourseMessage"></a>
# **getCourseMessage**
> List getCourseMessage(id)

Your GET endpoint

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | [default to null] |

### Return type

[**List**](../Models/Message.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getCourses"></a>
# **getCourses**
> List getCourses(name)



    Get courses

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **name** | **String**| The name to filter courses by | [optional] [default to null] |

### Return type

[**List**](../Models/Course.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getCoursesId"></a>
# **getCoursesId**
> Course getCoursesId(id)



    Get an Course by Id

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the course to work with | [default to null] |

### Return type

[**Course**](../Models/Course.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getGroupId"></a>
# **getGroupId**
> Group getGroupId(id)



    Get a Group by Id

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the group to work with | [default to null] |

### Return type

[**Group**](../Models/Group.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getGroupMessage"></a>
# **getGroupMessage**
> List getGroupMessage(id)

Your GET endpoint

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **String**|  | [default to null] |

### Return type

[**List**](../Models/Message.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUserFavoriteCourses"></a>
# **getUserFavoriteCourses**
> List getUserFavoriteCourses(userId)

get user favorite course list

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | **String**|  | [default to null] |

### Return type

[**List**](../Models/LearnerInCourse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsers"></a>
# **getUsers**
> List getUsers(name)



    Get Users

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **name** | **String**| The name to filter users by | [optional] [default to null] |

### Return type

[**List**](../Models/User.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsersId"></a>
# **getUsersId**
> User getUsersId(id)



    Get a User by Id

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the user to work with | [default to null] |

### Return type

[**User**](../Models/User.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="getUsersUseridGroups"></a>
# **getUsersUseridGroups**
> List getUsersUseridGroups(userid)

Your GET endpoint

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userid** | **String**|  | [default to null] |

### Return type

[**List**](../Models/LearnerInGroup.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="postAuthLogin"></a>
# **postAuthLogin**
> post_auth_login_200_response postAuthLogin(post\_auth\_login\_request)



    Perform login and return accesstoken

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **post\_auth\_login\_request** | [**post_auth_login_request**](../Models/post_auth_login_request.md)|  | [optional] |

### Return type

[**post_auth_login_200_response**](../Models/post_auth_login_200_response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json, application/xml

<a name="postAuthRegister"></a>
# **postAuthRegister**
> postAuthRegister(post\_auth\_register\_request)



    Perform registration

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **post\_auth\_register\_request** | [**post_auth_register_request**](../Models/post_auth_register_request.md)|  | [optional] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

<a name="postCourses"></a>
# **postCourses**
> Course postCourses(Course)



    Post course

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **Course** | [**Course**](../Models/Course.md)| The Course Object to create and the newly added Files | |

### Return type

[**Course**](../Models/Course.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="postGroups"></a>
# **postGroups**
> Group postGroups(Group)

Post group

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **Group** | [**Group**](../Models/Group.md)|  | |

### Return type

[**Group**](../Models/Group.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="postSectionCourse"></a>
# **postSectionCourse**
> Section postSectionCourse(id, Section)



    Create section in course

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the course | [default to null] |
| **Section** | [**Section**](../Models/Section.md)| The Section Object to create | |

### Return type

[**Section**](../Models/Section.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="postSectionFile"></a>
# **postSectionFile**
> Section postSectionFile(sectionId, file)



    Add file to section

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **sectionId** | **UUID**| The id of the section | [default to null] |
| **file** | **File**|  | [optional] [default to null] |

### Return type

[**Section**](../Models/Section.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

<a name="postSectionGroup"></a>
# **postSectionGroup**
> Section postSectionGroup(id, Section)



    Create section in group

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the group | [default to null] |
| **Section** | [**Section**](../Models/Section.md)| The Section Object to create | |

### Return type

[**Section**](../Models/Section.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="putAuthResetpassword"></a>
# **putAuthResetpassword**
> putAuthResetpassword(put\_auth\_resetpassword\_request)

Update password

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **put\_auth\_resetpassword\_request** | [**put_auth_resetpassword_request**](../Models/put_auth_resetpassword_request.md)|  | [optional] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

<a name="putCourse"></a>
# **putCourse**
> putCourse(id, Course)

update a course by only course creator

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the course to work with | [default to null] |
| **Course** | [**Course**](../Models/Course.md)|  | [optional] |

### Return type

null (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: Not defined

<a name="putGroup"></a>
# **putGroup**
> putGroup(id, Group)

update a group

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the group to work with | [default to null] |
| **Group** | [**Group**](../Models/Group.md)|  | [optional] |

### Return type

null (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="putSectionCourse"></a>
# **putSectionCourse**
> Section putSectionCourse(courseId, sectionId, Section)



    Update section in a course

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **courseId** | **UUID**| The id of the course | [default to null] |
| **sectionId** | **UUID**| The id of the section | [default to null] |
| **Section** | [**Section**](../Models/Section.md)|  | [optional] |

### Return type

[**Section**](../Models/Section.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="putSectionGroup"></a>
# **putSectionGroup**
> Section putSectionGroup(groupId, sectionId, Section)



    Update section in a group

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **groupId** | **UUID**| The id of the group | [default to null] |
| **sectionId** | **UUID**| The id of the section | [default to null] |
| **Section** | [**Section**](../Models/Section.md)|  | [optional] |

### Return type

[**Section**](../Models/Section.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: application/json
- **Accept**: application/json

<a name="putUserFavoriteCourse"></a>
# **putUserFavoriteCourse**
> LearnerInCourse putUserFavoriteCourse(userId, courseId)

put a user favorite course

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | **String**|  | [default to null] |
| **courseId** | **String**|  | [default to null] |

### Return type

[**LearnerInCourse**](../Models/LearnerInCourse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="putUsersId"></a>
# **putUsersId**
> User putUsersId(id, id2, firstName, lastName, email, photo)



    Put User

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | **UUID**| The id of the user to work with | [default to null] |
| **id2** | **String**|  | [optional] [default to null] |
| **firstName** | **String**|  | [optional] [default to null] |
| **lastName** | **String**|  | [optional] [default to null] |
| **email** | **String**|  | [optional] [default to null] |
| **photo** | **File**|  | [optional] [default to null] |

### Return type

[**User**](../Models/User.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: multipart/form-data
- **Accept**: application/json

<a name="putUsersUserIDCourseCourseID"></a>
# **putUsersUserIDCourseCourseID**
> putUsersUserIDCourseCourseID(userID, courseID)



    

### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userID** | **String**|  | [default to null] |
| **courseID** | **String**|  | [default to null] |

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined

<a name="putUsersUseridCourseCourseidGroupGroupid"></a>
# **putUsersUseridCourseCourseidGroupGroupid**
> LearnerInGroup putUsersUseridCourseCourseidGroupGroupid(userid, courseid, groupid)



### Parameters

|Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userid** | **String**|  | [default to null] |
| **courseid** | **String**|  | [default to null] |
| **groupid** | **String**|  | [default to null] |

### Return type

[**LearnerInGroup**](../Models/LearnerInGroup.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

