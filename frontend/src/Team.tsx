import React from "react";
import axios from "axios";
import CardDeck from "react-bootstrap/CardDeck";
import Card from "react-bootstrap/Card";
import Loading from "./Loading";

//Component for data used in about page
class Team extends React.Component {
  static names = [
    "daniel",
    "aly",
    "ishan",
    "safin",
    "shreyas",
    "anish",
    "total",
  ];

  static bios: any = {
    daniel:
      "I am a junior interested in front end development with some" +
      " internship experience in backend development.",
    aly:
      "I am a junior with internship and project experience in web" +
      " and mobile app development. I am most interested in full" +
      "stack development.",
    ishan:
      "I'm a junior interested in full stack development. " +
      "I have experience with web development, database design, " +
      "and RESTful APIs.",
    safin:
      "I’m a CS major and an aspiring software engineer," +
      "with interests in web design and data science.",
    shreyas:
      "I am a junior interested in back-end software development," +
      " with experience in Data Engineering and ML.",
    anish:
      "I am a junior with internship experience in data" +
      " science and machine learning, and personal experience with web design.",
  };

  static roles: any = {
    daniel: "Frontend Developer",
    aly: "Full Stack Developer",
    ishan: "Backend Developer",
    safin: "Frontend Developer",
    shreyas: "Full Stack Developer",
    anish: "Technical Report and Frontend Developer",
  };

  static linkedins: any = {
    daniel: "https://www.linkedin.com/in/ddeng154/",
    aly: "https://www.linkedin.com/in/aly-hirani/",
    ishan: "https://www.linkedin.com/in/ishan-phadke/",
    safin: "https://www.linkedin.com/in/safin-kasturi/",
    shreyas: "https://www.linkedin.com/in/shreyas-konana-39b926157/",
    anish: "https://www.linkedin.com/in/anish-yellaturu-5955a3187/",
  };

  state = {
    info: new Map<string, Info>(),
    isLoading: true,
  };

  componentDidMount() {
    type PersonStats = {
      name: string;
      commits: number;
      issues: number;
      tests: number;
    };
    axios.get<PersonStats[]>("/api/gitlabstats").then((response) => {
      const info = new Map<string, Info>();
      for (let n of Team.names) {
        const stats = response.data.find((s) => s.name === n);
        const b: string = Team.bios[n];
        const l: string = Team.linkedins[n];
        const r: string = Team.roles[n];
        const c = stats ? stats.commits : 0;
        const i = stats ? stats.issues : 0;
        const t = stats ? stats.tests : 0;
        info.set(n, new Info(n, b, l, r, c, i, t));
      }
      this.setState({ info, isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <div>
        <CardDeck>
          <Person
            fullName="Daniel Deng"
            info={this.state.info.get("daniel")!}
          />
          <Person fullName="Aly Hirani" info={this.state.info.get("aly")!} />
          <Person
            fullName="Ishan Phadke"
            info={this.state.info.get("ishan")!}
          />
        </CardDeck>
        <CardDeck>
          <Person
            fullName="Safin Kasturi"
            info={this.state.info.get("safin")!}
          />
          <Person
            fullName="Shreyas Konana"
            info={this.state.info.get("shreyas")!}
          />
          <Person
            fullName="Anish Yellaturu"
            info={this.state.info.get("anish")!}
          />
        </CardDeck>
        <h2>Total Stats</h2>
        <p>Commits: {this.state.info.get("total")!.commits}</p>
        <p>Issues: {this.state.info.get("total")!.issues}</p>
        <p>Unit Tests: {this.state.info.get("total")!.tests}</p>
      </div>
    );
  }
}

class Info {
  name: string;
  bio: string;
  linkedin: string;
  role: string;
  commits: number;
  issues: number;
  tests: number;

  constructor(
    n: string,
    b: string,
    l: string,
    r: string,
    c: number,
    i: number,
    t: number
  ) {
    this.name = n;
    this.bio = b;
    this.linkedin = l;
    this.role = r;
    this.commits = c;
    this.issues = i;
    this.tests = t;
  }
}

type PersonProps = {
  fullName: string;
  info: Info;
};

function Person({ fullName, info }: PersonProps) {
  const image = require("./images/" + info.name + ".jpg");
  return (
    <Card>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>
          <a href={info.linkedin}>{fullName}</a>
        </Card.Title>
        <Card.Text>
          {info.bio}
          <br />
          <br />
          {info.role}
          <br />
          <br />
          Commits: {info.commits}
          <br />
          <br />
          Issues: {info.issues}
          <br />
          <br />
          Unit Tests: {info.tests}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Team;
