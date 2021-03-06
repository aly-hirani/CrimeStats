import React from "react";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import Table from "react-bootstrap/Table";
import { APIResponse } from "./common";
import Loading from "./Loading";

//models component for Police departments
type PoliceDepartmentData = {
  ori: string;
  name: string;
  pop: number;
  num_male_officers: number;
  num_female_officers: number;
  num_civilians: number;
  dept_type: string;
  div_name: string;
  reg_name: string;
  density_per_1000: number;
};

//lists of values to filter by
const FilterVals = new Map([
  [
    "div_name",
    [
      "New England",
      "East North Central",
      "Mountain",
      "U.S. Territories",
      "Middle Atlantic",
      "Pacific",
      "East South Central",
      "West South Central",
      "West North Central",
      "South Atlantic",
    ],
  ],
  ["reg_name", ["West", "South", "U.S. Territories", "Midwest", "Northeast"]],
  ["dept_type", ["State Police", "Other", "County", "City"]],
]);

class PoliceDepartments extends React.Component {
  state = {
    elements: new Array<PoliceDepartmentData>(),
    page: 1,
    totalPages: 1,
    sort: "name",
    asc: "asc",
    filter: "",
    val: "",
    isLoading: true,
  };

  componentDidMount() {
    this.fetchElements();
  }

  fetchElements = () => {
    this.setState({ isLoading: true });
    const order_by = [{ field: this.state.sort, direction: this.state.asc }];
    const filters = [];
    if (this.state.filter && this.state.val) {
      filters.push({ name: this.state.filter, op: "eq", val: this.state.val });
    }
    const q = JSON.stringify({ order_by, filters });
    const url = `/api/police_departments?q=${q}&page=${this.state.page}`;
    axios.get<APIResponse<PoliceDepartmentData>>(url).then((response) => {
      this.setState({
        elements: response.data.objects,
        totalPages: response.data.total_pages,
        isLoading: false,
      });
    });
  };

  previousPage = () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 }, this.fetchElements);
    } else if (this.state.totalPages > 1) {
      this.setState({ page: this.state.totalPages }, this.fetchElements);
    }
  };

  nextPage = () => {
    if (this.state.page < this.state.totalPages) {
      this.setState({ page: this.state.page + 1 }, this.fetchElements);
    } else if (this.state.totalPages > 1) {
      this.setState({ page: 1 }, this.fetchElements);
    }
  };

  changeSort = (sort: string) => {
    this.setState({ sort }, this.fetchElements);
  };

  changeAsc = (asc: string) => {
    this.setState({ asc }, this.fetchElements);
  };

  changeFilter = (filter: string) => {
    this.setState({ filter, val: "" }, this.fetchElements);
  };

  changeVal = (val: string) => {
    this.setState({ val }, this.fetchElements);
  };

  SortingItem = (attributeName: string, displayName: string) => {
    return (
      <Dropdown.Item
        active={this.state.sort === attributeName}
        onClick={() => this.changeSort(attributeName)}
      >
        {displayName}
      </Dropdown.Item>
    );
  };

  SortingButton = (asc: string, name: string) => {
    return (
      <Button
        variant={this.state.asc === asc ? "primary" : "secondary"}
        onClick={() => this.changeAsc(asc)}
      >
        {name}
      </Button>
    );
  };

  FilterItem = (attributeName: string, displayName: string) => {
    return (
      <Dropdown.Item
        active={this.state.filter === attributeName}
        onClick={() => this.changeFilter(attributeName)}
      >
        {displayName}
      </Dropdown.Item>
    );
  };

  ValueItem = (name: string) => {
    return (
      <Dropdown.Item
        key={name}
        active={this.state.val === name}
        onClick={() => this.changeVal(name)}
      >
        {name}
      </Dropdown.Item>
    );
  };

  Pagination = () => {
    return (
      <div>
        <Button onClick={this.previousPage}>Previous</Button>
        {` ${this.state.page} of ${this.state.totalPages} `}
        <Button onClick={this.nextPage}>Next</Button>
      </div>
    );
  };

  Sorting = () => {
    return (
      <div>
        <Dropdown>
          <Dropdown.Toggle>Sort</Dropdown.Toggle>
          <Dropdown.Menu>
            {this.SortingItem("name", "Name")}
            {this.SortingItem("pop", "Population")}
            {this.SortingItem("num_male_officers", "Male Officers")}
            {this.SortingItem("num_female_officers", "Female Officers")}
            {this.SortingItem("num_civilians", "Civilians")}
            {this.SortingItem("density_per_1000", "Density")}
          </Dropdown.Menu>
          {this.SortingButton("asc", "Ascending")}
          {this.SortingButton("desc", "Descending")}
        </Dropdown>
      </div>
    );
  };

  Filters = () => {
    return (
      <div>
        <ButtonGroup>
          <Dropdown>
            <Dropdown.Toggle>Filter</Dropdown.Toggle>
            <Dropdown.Menu>
              {this.FilterItem("", "No Filter")}
              {this.FilterItem("dept_type", "Department Type")}
              {this.FilterItem("div_name", "Division Name")}
              {this.FilterItem("reg_name", "Region Name")}
            </Dropdown.Menu>
          </Dropdown>
          {this.Values()}
        </ButtonGroup>
      </div>
    );
  };

  Values = () => {
    const vals = FilterVals.get(this.state.filter);
    if (vals) {
      return (
        <Dropdown>
          <Dropdown.Toggle>Value</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              active={this.state.val === ""}
              onClick={() => this.changeVal("")}
            >
              All Values
            </Dropdown.Item>
            {vals.map(this.ValueItem)}
          </Dropdown.Menu>
        </Dropdown>
      );
    }
  };

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <div className="text-center">
        <h1>Police Departments</h1>
        <div>
          <Button href="/comparepolicedepartments">Compare</Button>
        </div>
        <br />
        <this.Sorting />
        <br />
        <this.Filters />
        <br />
        <this.Pagination />
        <br />
        {/* Table of basic model data */}
        <Table striped bordered hover>
          <thead>
            <tr>{headerCols()}</tr>
          </thead>
          <tbody>{this.state.elements.map(PoliceDepartmentRow)}</tbody>
        </Table>
        <this.Pagination />
      </div>
    );
  }
}

const policeFields = [
  "Name",
  "Population",
  "No. Male Officers",
  "No. Female Officers",
  "No. Civilians",
  "Department Type",
  "Division Name",
  "Region Name",
  "Density per 1000",
];
function headerCols() {
  let index = -1;
  return policeFields.map((policeField) => {
    index += 1;
    return <th key={index}>{policeField}</th>;
  });
}

//returns the table row with data for each PD
function PoliceDepartmentRow(pd: PoliceDepartmentData) {
  const policeDatas = [
    pd.pop,
    pd.num_male_officers,
    pd.num_female_officers,
    pd.num_civilians,
    pd.dept_type,
    pd.div_name,
    pd.reg_name,
    pd.density_per_1000,
  ];
  function TableVals() {
    let index = 1;
    return policeDatas.map((policeData) => {
      index += 1;
      return <td key={index}>{policeData}</td>;
    });
  }
  return (
    <tr key={pd.ori}>
      <td>
        <Nav.Link key={pd.name} href={"/policedepartments/" + pd.ori}>
          {pd.name}
        </Nav.Link>
      </td>
      {TableVals()}
    </tr>
  );
}

export default PoliceDepartments;
