import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import { either, fold } from "fp-ts/lib/Either";
import fieldset from "./fieldset.json";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { reporter } from "io-ts-reporters";
import { pipe } from "fp-ts/lib/pipeable";
import { DragDropContext } from "react-beautiful-dnd";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";

//
const MetaOptional = t.partial({
  field_name: t.string
});
const FieldDecoder = t.type({
  meta: t.intersection([
    t.type({
      component: t.string
    }),
    MetaOptional
  ]),
  id: t.string
});
const GroupDecoder = t.type({
  id: t.string,
  fields: t.array(FieldDecoder),
  meta: t.type({ group_name: t.string })
});
const ScreenDecoder = t.type({ id: t.string, groups: t.array(GroupDecoder) });
type ScreenType = t.TypeOf<typeof ScreenDecoder>;
type GroupType = t.TypeOf<typeof GroupDecoder>;
type FieldType = t.TypeOf<typeof FieldDecoder>;

// const FieldsetType = t.type({
//   userId: t.number,
//   name: t.string
// });

function decode<Type, OutPut, Input>(
  validator: t.Type<Type, OutPut, Input>,
  input: Input
): Type {
  let result: Type;
  const decodedData = validator.decode(input);
  fold(
    errors => {
      const messages = reporter(decodedData);
      console.log(new Error(messages.join("\n")));
    },
    value => (result = value as Type)
  );
  return result;
}

export function decodeToPromise<Type, OutPut, Input>(
  validator: t.Type<Type, OutPut, Input>,
  input: Input
): Promise<Type> {
  const result = validator.decode(input);
  return new Promise((resolve, reject) => {
    pipe(
      result,
      fold(
        errors => {
          const messages = reporter(result);
          reject(new Error(messages.join("\n")));
        },
        value => resolve(value)
      )
    );
  });
}
function Home() {
  const router = useRouter();
  const [data, setData] = React.useState<ScreenType>();
  // let data = ScreenDecoder.decode(fieldset);
  React.useEffect(() => {
    const cc_id = router.query.cc_id;
    console.log("query", router);
    if (cc_id) {
      fetch(`/static/${cc_id}.json`)
        .then(function(response) {
          return response.json();
        })
        .then((data: any) => {
          decodeToPromise(ScreenDecoder, data.screens[0])
            .then(decodedData => {
              setData(decodedData);
              console.log("decoded");
            })
            .catch(error => {
              console.error(error);
              console.log("decode error");
            });
        });
    }
  }, []);

  return <div>{data ? <Screen config={data}></Screen> : null}</div>;
}

function Screen({ config }: { config: ScreenType }) {
  return (
    <div>
      {config.groups.map(group => (
        <Group key={group.id} config={group}></Group>
      ))}
    </div>
  );
}
function Group({ config }: { config: GroupType }) {
  return (
    <div className="" style={{ minHeight: 100, border: "1px solid blue" }}>
      <div>
        <span className="font-bold">Group Name: </span>
        {config.meta.group_name}
      </div>
      {config.fields.map(field => (
        <Field key={field.id} config={field}></Field>
      ))}
    </div>
  );
}

function Field({ config }: { config: FieldType }) {
  const [collapse, setCollapse] = React.useState(true);
  let RenderComponent = null;

  switch (config.meta.field_name) {
    case "photos":
      RenderComponent = <Photos></Photos>;
      break;
    default:
      RenderComponent = (
        <div>
          {config.meta.field_name} - {config.meta.component}
        </div>
      );
      break;
  }
  return (
    <div>
      <div onClick={() => setCollapse(collapse => !collapse)}>
        Field name: {config.meta.field_name}
      </div>
      {collapse ? null : (
        <p style={{ whiteSpace: "pre", background: "lightgrey" }}>
          {JSON.stringify(config, null, 2)}
        </p>
      )}
    </div>
  );
}

function Photos({}) {
  return <div className="font-bold">photos comp</div>;
}

export default Home;
