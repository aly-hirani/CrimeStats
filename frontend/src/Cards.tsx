import React from "react";
import { Col, Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import img1 from "./images/county-image.jpg";
import img2 from "./images/police-image.jpg";
import img3 from "./images/crime-image.jpg";
import "./Cards.css";
//used to display the cards that are links to counties/police departments
//or crimes, on the splash page
function Cards() {
  return (
    <div className="cards">
      <Container fluid className="cards-container">
        <div className="d-flex justify-content-between">
          <Col>
            {/* card for counties */}
            <Link to="/counties">
              <Card>
                <div className="image">
                  <Card.Img variant="top" src={img1} />
                </div>
                <Card.Body>
                  <Card.Title>Counties</Card.Title>
                  <Card.Text>
                    Look up statistics on crime data for each county in the U.S.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col>
            {/* card for police departments */}
            <Link to="/policedepartments">
              <Card>
                <div className="image">
                  <Card.Img variant="top" src={img2} />
                </div>
                <Card.Body>
                  <Card.Title>Police Departments</Card.Title>
                  <Card.Text>
                    Look up statistics for police departments in the U.S.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          <Col>
            {/* card for crimes */}
            <Link to="/crimes">
              <Card>
                <div className="image">
                  <Card.Img variant="top" src={img3} />
                </div>
                <Card.Body>
                  <Card.Title>Crimes</Card.Title>
                  <Card.Text>
                    Look up details for each individual crime that occurred.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </div>
      </Container>
    </div>
  );
}

export default Cards;
