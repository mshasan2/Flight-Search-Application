import flightsModel from "./flights-model.js";

export const findFlights = () => flightsModel.find();

export const searchFlightsOnOrigin = async (query) => {
    const flights_full_name = await flightsModel.find({
        $expr: {
            $regexMatch: {
                input: "$origin_full_name",
                regex: new RegExp(query, "i")
            }
        }
    })
    const flights_code_name = await flightsModel.find({
        $expr: {
            $regexMatch: {
                input: "$origin",
                regex: new RegExp(query, "i")
            }
        }
    })
    const combinedUniqueElements = Array.from(new Set([...flights_full_name, ...flights_code_name]));
    return combinedUniqueElements;
};

export const searchFlightsOnDestination = async (query) => {
    const flights_full_name = await flightsModel.find({
        $expr: {
            $regexMatch: {
                input: "$destination_full_name",
                regex: new RegExp(query, "i")
            }
        }
    })
    const flights_code_name = await flightsModel.find({
        $expr: {
            $regexMatch: {
                input: "$destination",
                regex: new RegExp(query, "i")
            }
        }
    })
    const combinedUniqueElements = Array.from(new Set([...flights_full_name, ...flights_code_name]));
    return combinedUniqueElements;
};


export const suggest = async (query) => {
    const destinations = await flightsModel.distinct('destination_full_name', {
        $or: [
          { destination_full_name: { $regex: query, $options: 'i' } },
          { destination: { $regex: query, $options: 'i' } }
        ],
      });
  
      const origins = await flightsModel.distinct('origin_full_name', {
        $or: [
          { origin_full_name: { $regex: query, $options: 'i' } },
          { origin: { $regex: query, $options: 'i' } }
        ],
      });
  
      const combinedUniqueElements = Array.from(new Set([...destinations, ...origins]));
  
      return combinedUniqueElements.slice(0, 10);
}

