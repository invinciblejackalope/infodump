async function handleSearchResponse(response) {
  if (!response.ok) {
    throw new Error(response.error);
  }

  return await response.json();
}

function CatImage(props) {
  const queryClient = ReactQuery.useQueryClient();

  async function fetchCatImage(id) {
    const response = await fetch(`https://api.thecatapi.com/v1/images/${id}`);
    return await handleSearchResponse(response);
  }

  const query = ReactQuery.useQuery(['catImage', props.name], () => fetchCatImage(props.id), {
    staleTime: Infinity,
    refetchOnWindowFocus: false
  });

  if (query.isLoading) {
    return /*#__PURE__*/React.createElement("p", null, "Loading image...");
  }

  if (query.isError) {
    return /*#__PURE__*/React.createElement("p", null, "Error: ", query.error.message);
  }

  return /*#__PURE__*/React.createElement("img", {
    height: "200px",
    src: query.data.url
  });
}

function CatAPIRow(props) {
  const breed = props.breed;
  return /*#__PURE__*/React.createElement("div", {
    className: "section center horizontal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "center vertical description"
  }, /*#__PURE__*/React.createElement("div", {
    className: "center horizontal"
  }, breed.reference_image_id && /*#__PURE__*/React.createElement(CatImage, {
    name: breed.name,
    id: breed.reference_image_id
  }) || /*#__PURE__*/React.createElement("p", null, " (No image provided) "))), /*#__PURE__*/React.createElement("div", {
    className: "center vertical description"
  }, /*#__PURE__*/React.createElement("p", null, " ", /*#__PURE__*/React.createElement("a", {
    href: breed.wikipedia_url
  }, /*#__PURE__*/React.createElement("b", null, " ", breed.name, " ")), " "), /*#__PURE__*/React.createElement("p", null, " ", breed.description || '(No description provided)', " ")));
}

const queryClient = new ReactQuery.QueryClient();

class CatAPI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      breedData: null
    };
  } // https://oeis.org/search?q=id:A${event.target.value}&fmt=json
  // Original idea was OEIS, but site does not support CORS


  async handleChange(event) {
    this.setState({
      query: event.target.value
    });
    const breedData = await this.fetchCatSearch(event.target.value).catch(e => null);
    this.setState({
      breedData: breedData
    });
  }

  async fetchCatSearch(query) {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds/search?q=${query}`);
    const data = await handleSearchResponse(response);
    return data.slice(0, 10);
  } // https://stackoverflow.com/questions/41374572/how-to-render-an-array-of-objects-in-react


  render() {
    return /*#__PURE__*/React.createElement(ReactQuery.QueryClientProvider, {
      client: queryClient
    }, /*#__PURE__*/React.createElement("form", null, /*#__PURE__*/React.createElement("label", null, "Enter query (e.g. Siamese):", /*#__PURE__*/React.createElement("input", {
      type: "text",
      value: this.state.query,
      onChange: this.handleChange.bind(this)
    }))), this.state.breedData && this.state.breedData.length > 0 && this.state.breedData.map(breed => /*#__PURE__*/React.createElement(CatAPIRow, {
      key: breed.name,
      breed: breed
    })) || this.state.query !== '' && /*#__PURE__*/React.createElement("div", {
      className: "center horizontal full-width"
    }, /*#__PURE__*/React.createElement("p", null, " (No search results found) ")));
  }

}

ReactDOM.render( /*#__PURE__*/React.createElement(CatAPI, null), document.getElementById('cat-api'));