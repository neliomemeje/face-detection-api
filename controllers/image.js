const clarifaiSetup = (imageUrl) => {
  const PAT = API_CLARIFAI;
  const USER_ID = "ui8i7ggow7tm";
  const APP_ID = "test";
  const IMAGE_URL = imageUrl;
  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };
  return requestOptions;
};

const handleApiCall = (req, res) => {
  fetch(
    "https://api.clarifai.com/v2/models/face-detection/outputs",
    clarifaiSetup(req.body.input)
  )
    .then((response) => response.json())
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(400).json({ message: "Error communicating with api." });
    });
};

const handleImage = (knex) => (req, res) => {
  const { id } = req.body;
  knex("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) =>
      res.status(400).json({ message: "unable to get entries." })
    );
};

module.exports = {
  handleImage,
  handleApiCall,
};
