import React from 'react';

function Attractions() {
  const attractions = [
    {
      id: 1,
      name: "Mount Rushmore National Memorial",
      distance: "30-minute drive",
      description: "No trip to the Black Hills is complete without a visit to this iconic American monument. Majestic figures of George Washington, Thomas Jefferson, Theodore Roosevelt, and Abraham Lincoln are carved directly into the granite face of Mount Rushmore, representing 150 years of American history.",
      // Using your local file
      image: "/Ruesmore1.jpg"
    },
    {
      id: 2,
      name: "Badlands National Park",
      distance: "60-minute drive",
      description: "Experience the striking geologic deposits and rugged beauty of the Badlands. This incredible landscape features layered rock formations, steep canyons, and towering spires. Keep an eye out for bighorn sheep, bison, and prairie dogs as you drive the scenic loop or hike the trails.",
      // Using your local file
      image: "/Badlands3.jpg"
    },
    {
      id: 3,
      name: "Custer State Park",
      distance: "40-minute drive",
      description: "Famous for its stunning scenic drives—including the Needles Highway and Wildlife Loop Road—Custer State Park is a nature lover's paradise. It is home to clear mountain waters, soaring granite peaks, and one of the nation's largest free-roaming bison herds.",
      // Using your local file
      image: "/Buffalo1.jpg"
    },
    {
      id: 4,
      name: "Crazy Horse Memorial",
      distance: "45-minute drive",
      description: "Witness history in the making at the world's largest mountain carving in progress. Dedicated to protecting and preserving the culture, tradition, and living heritage of North American Indians, this massive monument honoring the Oglala Lakota warrior is a breathtaking sight.",
      // Using your local file
      image: "/crazyhorse.jpg"
    },
    {
      id: 5,
      name: "City of Presidents (Downtown Rapid City)",
      distance: "10-minute drive",
      description: "Take a walking tour through historic downtown Rapid City and discover a series of life-size bronze statues of our nation's past presidents. It is a fantastic way to explore local shops, cafes, and galleries while enjoying a unique piece of American history.",
      // Using your local file
      image: "/President.jpg"
    },
    {
      id: 6,
      name: "Canyon Lake Park",
      distance: "5-minute drive",
      description: "Just minutes from our front door, Canyon Lake Park offers a beautiful, peaceful setting right in the city. Enjoy fishing, paddle boating, or simply walking along the shaded paths surrounding the water. It is the perfect spot for a relaxed afternoon picnic.",
      // Using your local file
      image: "/Canyonkake.jpg"
    }
  ];

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d4a22', marginBottom: '15px' }}>Explore the Black Hills</h1>
        <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Cleghorn Canyon is perfectly situated to give you easy access to the most incredible natural wonders and historic monuments in South Dakota.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
        {attractions.map(attraction => (
          <div key={attraction.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
            
            {/* Attraction Image */}
            <div style={{ 
              height: '250px', 
              backgroundImage: `url(${attraction.image})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              backgroundColor: '#eee' 
            }}></div>
            
            {/* Attraction Details */}
            <div style={{ padding: '30px', flex: '1', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#2d4a22', margin: 0 }}>{attraction.name}</h2>
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#88a87d', backgroundColor: '#f4f7f6', padding: '5px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                  {attraction.distance}
                </span>
              </div>
              
              <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6', margin: 0, flex: '1' }}>
                {attraction.description}
              </p>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}

export default Attractions;