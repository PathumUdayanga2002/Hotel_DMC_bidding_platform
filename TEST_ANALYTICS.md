# Analytics Troubleshooting Guide

## Changes Made

### Backend Changes
1. **Modified `PlatformAnalyticsServiceImpl.getTopHotelMarkets()`**:
   - Changed from querying `hotel_bids` collection (which only shows hotels with bids)
   - Now queries `hotel_profiles` collection directly (shows ALL registered hotels with APPROVED status)
   - Enriches each hotel with bid statistics (totalBids, acceptedBids, avgBidValue, revenue)
   - Hotels with 0 bids will now appear with statistics showing 0

### Frontend Changes
1. **Added enhanced logging in `PlatformAnalytics.jsx`**:
   - Logs analytics response
   - Logs topHotelMarkets array
   - Logs topHotelMarkets length
   - Added error details in console

## How to Test

### 1. Check Browser Console
Open the admin portal and go to Platform Analytics page. Check the browser console (F12) for:

```
Fetching analytics with params: ...
Analytics response: {...}
Top hotels count: X
Analytics data: {...}
Top Hotel Markets: [...]
Top Hotel Markets length: X
```

### 2. Check if Hotels Exist
The backend now shows ALL approved hotels. If no hotels appear:
- Check if there are any APPROVED hotels in the database
- Run this in MongoDB:
  ```javascript
  db.hotel_profiles.find({ status: "APPROVED" }).count()
  ```

### 3. Expected Behavior
- **Before**: Only hotels that have placed bids were shown
- **After**: ALL approved hotels are shown, with bid statistics (0 if no bids)
- Hotels are sorted by: Total Bids (default), Revenue, Success Rate, or Avg Bid Value
- Can filter by: City name, Minimum star rating
- Can limit: Top 5, 10, 20, or 50 hotels

## Debugging Steps

1. **Check if data is being fetched**:
   - Open browser DevTools → Network tab
   - Look for request to `/api/v1/admin/analytics?limit=10&sortBy=totalbids`
   - Check response status (should be 200)
   - Check response body → data → topHotelMarkets array

2. **Check if hotels are approved in database**:
   ```bash
   # Connect to MongoDB and run:
   db.hotel_profiles.aggregate([
     { $match: { status: "APPROVED" } },
     { $project: { name: 1, city: 1, hotelStars: 1, status: 1 } }
   ])
   ```

3. **Check backend logs**:
   ```bash
   tail -f /tmp/backend.log | grep -i "top.*hotel\|analytics"
   ```

   Look for:
   - "Fetching top X hotel markets with filters"
   - Any errors or exceptions

4. **Test the endpoint directly** (after logging in to admin portal):
   ```bash
   # Export cookies from browser and test
   curl -b "cookies.txt" "http://localhost:8081/api/v1/admin/analytics?limit=5&sortBy=totalbids"
   ```

## Common Issues

1. **No hotels in database**: 
   - Solution: Register and approve at least one hotel

2. **Authentication error (401)**:
   - Solution: Make sure you're logged in as admin
   - Check if JWT token is being sent in cookies

3. **Empty array returned**:
   - Check if query filters are too restrictive (city filter, star filter)
   - Try with no filters: just `limit=10`

4. **Frontend shows "No hotel data available"**:
   - Check console logs to see if data was received
   - Check if `topHotelMarkets` array exists in response
   - Check if there's a JavaScript error preventing render
