
import { readFileSync } from "node:fs";
import { GraphQLScalarType, Kind } from "graphql";

const data = JSON.parse(
  readFileSync(
    new URL("../data/applications.json", import.meta.url),
    "utf8"
  )
);

export const resolvers = {
  DateTime: new GraphQLScalarType({
    name: "DateTime",

    serialize(value: unknown) {
      const date = new Date(String(value));

      if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid DateTime value");
      }

      return date.toISOString();
    },

    parseValue(value: unknown) {
      const date = new Date(String(value));

      if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid DateTime value");
      }

      return date;
    },

    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new Error("DateTime must be a string");
      }

      return new Date(ast.value);
    }
  }),

  Query: {
    applications: (_parent: unknown, args: any) => {  //the underscore in _parent indicates that the parent argument is not used in this resolver function. It's a common convention to use an underscore prefix for unused parameters to avoid linter warnings or errors about unused variables.
      let results = data.applications;                //the unkown type is used for the _parent argument because it can be of any type, and we don't have specific information about its structure or type in this context.

      if (args.status) {
        results = results.filter(
          (application: any) =>
            application.status === args.status
        );
      }

      return results.slice(
        args.offset ?? 0,
        (args.offset ?? 0) + (args.limit ?? 20)
      );
    },

    application: (_parent: unknown, args: any) => {
      return data.applications.find(
        (application: any) => application.id === args.id
      ) ?? null;
    },

    applicant: (_parent: unknown, args: any) => {
      return data.applicants.find(
        (applicant: any) => applicant.id === args.id
      ) ?? null;
    }
  },

  Applicant: {
    applications: (parent: any) => {
      return parent.applicationIds.map((id: string) =>
        data.applications.find(
          (application: any) => application.id === id
        )
      );
    }
  },

  //Nested objects

  Application: {  //The GraphQL object type
    participants: (parent: any) => parent.participants,

    farm: (parent: any) =>  //Apollo will see that the query is asking for the farm field of an Application object, and it will call this resolver function to fetch the corresponding farm data based on the farmId of the parent Application object.
      data.farms.find(
        (farm: any) => farm.id === parent.farmId
      ),

    loanProgram: (parent: any) =>
      data.loanPrograms.find(
        (program: any) => program.id === parent.loanProgramId
      ),

    responses: (parent: any) =>
      parent.responseIds.map((id: string) =>
        data.responses.find(
          (response: any) => response.id === id
        )
      ),

    documents: (parent: any) =>
      parent.documentIds.map((id: string) =>
        data.documents.find(
          (document: any) => document.id === id
        )
      )
  },

  ApplicationParticipant: {
    applicant: (parent: any) =>
      data.applicants.find(
        (applicant: any) => applicant.id === parent.applicantId
      )
  }
};
