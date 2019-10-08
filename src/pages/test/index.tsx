import React from "react";

import { either, fold } from "fp-ts/lib/Either";
import fieldset from "./fieldset.json";
import * as t from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";
import { reporter } from "io-ts-reporters";
import { pipe } from "fp-ts/lib/pipeable";
import { DragDropContext } from "react-beautiful-dnd";
import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";
import fp from "lodash/fp";
import { Popover } from "antd";

const jsonFiles = [
  "SGCarsCarsForSale_1233_android2189_ios1094.json",
  "SGCarsCarsForSale_1233_android2375_ios1146_CarListingDetail.json",
  "SGCarsCommercialCarsForRent_2695_android2189_ios1094.json",
  "SGCarsCommercialCarsForRent_2695_android2375_ios1146_CarListingDetail.json",
  "SGCarsNewCommercialCarsForSale_2694_android2189_ios1094.json",
  "SGCarsNewCommercialCarsForSale_2694_android2375_ios1146_CarListingDetail.json",
  "SGCarsParallelImports_2316_android2189_ios1094.json",
  "SGCarsParallelImports_2316_android2375_ios1146_CarListingDetail.json",
  "SGCarsUsedCommercialCarsForSale_2696_android2189_ios1094.json",
  "SGCarsUsedCommercialCarsForSale_2696_android2375_ios1146_CarListingDetail.json",
  "SGCarsVehicleRentals_1241_android2189_ios1094.json",
  "SGCarsVehicleRentals_1241_android2375_ios1146_CarListingDetail.json",
  "SGNewCars_2562_android2189_ios1094.json",
  "SGNewCars_2562_android2375_ios1146_CarListingDetail.json",
  "SGMotorbikesClass2_1995_android2189_ios1094.json",
  "SGMotorbikesClass2_1995_android2375_ios1146_CarListingDetail.json",
  "SGMotorbikesClass2A_1996_android2189_ios1094.json",
  "SGMotorbikesClass2A_1996_android2375_ios1146_CarListingDetail.json",
  "SGMotorbikesClass2B_1997_android2189_ios1094.json",
  "SGMotorbikesClass2B_1997_android2375_ios1146_CarListingDetail.json"
];
//
const MetaOptional = t.partial({
  field_name: t.string,
  default_value: t.any
});
const FieldDecoder = t.type({
  meta: t.intersection([
    t.type({
      component: t.string
    }),
    MetaOptional
  ]),
  ui_rules: t.intersection([t.type({}), t.partial({ icon_path: t.any })]),
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

function Button({
  onClick,
  disabled,
  children,
  variant
}: {
  onClick: () => void;
  disabled?: boolean;
  variant?: "outline";
  children: React.ReactNode;
}) {
  let cssClass = "";
  if (variant === "outline") {
    cssClass = "border border-blue-500";
  }
  return (
    <button
      onClick={onClick}
      className={`ml-4 bg-transparent text-blue-700 font-semibold py-2 px-4 rounded ${cssClass} ${
        disabled
          ? `opacity-50 cursor-not-allowed`
          : "hover:bg-blue-500 hover:text-white hover:border-transparent"
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// const FieldsetType = t.type({
//   userId: t.number,
//   name: t.string
// });
function copyToClipboard(id: string) {
  /* Get the text field */
  var copyText = document.getElementById(id) as HTMLTextAreaElement;
  if (copyText) {
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");
  } else {
    alert(`Cannot found id: #${id}`);
  }
}
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
function noop() {}
function useInterval(callback, delay) {
  const savedCallback = React.useRef(noop);

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      if (savedCallback && savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
type SyncStatusMap = {
  [key: string]: boolean;
};
function Home({ data }: { data: any }) {
  const [dataNew, setDataNew] = React.useState<ScreenType>();
  const [syncStatus, setSyncStatus] = React.useState<SyncStatusMap>({});
  const [fieldsetInput, setFieldsetInput] = React.useState<any>();
  // let data = ScreenDecoder.decode(fieldset);
  const router = useRouter();
  React.useEffect(() => {
    if (router.query.file) {
      fetchData(`/api/get-fieldset?file_name=${router.query.file}`).then(
        (data: any) => {
          setDataNew(data.screens[0]);
        }
      );
    }
  }, [router.query.file]);
  useInterval(() => {
    fetchData(`/api/sync-status`).then((data: any) => {
      setSyncStatus(data);
    });
  }, 2000);
  return (
    <div className="flex flex-row-reverse justify-center">
      <div className="mb-4">
        <Button
          onClick={() => {
            fetchData(`/api/make-local-test`)
              .then(data => {
                alert("Make local_test success");
              })
              .catch(error => {
                alert(`Make local_test ${error}`);
              });
          }}
        >
          make local
        </Button>
        <Button
          onClick={() => {
            let fileString = jsonFiles
              .filter(fileName => fileName.includes("1095"))
              .join(",");

            fetchData(`/api/sync-all`)
              .then(data => {
                alert("Make local_test success");
              })
              .catch(error => {
                alert(`Make local_test ${error}`);
              });
          }}
        >
          sync all
        </Button>
        <Button
          onClick={() => {
            let fileString = jsonFiles
              .filter(fileName => fileName.includes("1095"))
              .join(",");

            fetchData(`/api/copy-stage-to-prod`)
              .then(data => {
                alert("copy stage to prod success");
              })
              .catch(error => {
                alert(`Make local_test ${error}`);
              });
          }}
        >
          Copy stage to prod
        </Button>
        {jsonFiles.map((item, index) => {
          const name = fp.compose(
            fp.last,
            fp.split("/")
          )(item);
          return (
            <div className="flex" key={item}>
              <div
                onClick={() => {
                  // fetchData(`/static/${item}`).then((data: any) => {
                  //   setDataNew(data.screens[0]);
                  // });
                  router.push(`/test?file=${name}`);
                }}
                className={`p-2 hover:bg-blue-400 hover:text-white cursor-pointer ${
                  router.query.file === name
                    ? "bg-blue-400 text-white"
                    : index % 2
                    ? "bg-blue-200"
                    : "bg-white"
                }`}
                style={{
                  width: 400,
                  borderRadius: 5,
                  overflow: "hidden"
                }}
              >
                {name}
              </div>
              <Button
                onClick={() => {
                  fetchData(`/api/open-file?file_name=${name}`)
                    .then(data => {})
                    .catch(error => {
                      alert(`Sync failed ${error}`);
                    });
                }}
              >
                Open
              </Button>
              {index % 2 ? (
                <Button
                  onClick={() => {
                    fetchData(`/api/sync-file?file_name=${name}`)
                      .then(data => {})
                      .catch(error => {
                        alert(`Sync failed ${error}`);
                      });
                  }}
                  disabled={syncStatus[name]}
                  variant="outline"
                >
                  {syncStatus[name] ? "Syncing" : "Sync"}
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
      {dataNew ? <Screen config={dataNew}></Screen> : null}
    </div>
  );
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
    <div className="mt-4" style={{ minHeight: 100, border: "1px solid white" }}>
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
  switch (config.meta.component) {
    case "photos":
      RenderComponent = Photos;
      break;
    // case "paragraph":
    //   RenderComponent = () => <Paragraph config={config}></Paragraph>;
    //   break;
    case "loan_calculator":
      RenderComponent = LoanCalculator;
      break;
    default:
      RenderComponent = () => (
        <div className="p-1 cursor-pointer">
          {config.meta.component} - {config.meta.field_name}
        </div>
      );
      break;
  }
  return (
    <div>
      <div
        className="hover:bg-blue-500 hover:text-white"
        onClick={() => setCollapse(collapse => !collapse)}
      >
        <RenderComponent></RenderComponent>
      </div>

      {collapse ? null : (
        <div className="flex flex-col">
          <button
            onClick={() => {
              copyToClipboard(config.meta.field_name);
            }}
            className="bg-green-200 hover:bg-green-400 hover:text-white"
          >
            copy to clip board
          </button>
          <textarea
            id={config.meta.field_name}
            style={{ whiteSpace: "pre", background: "lightgrey" }}
            rows={10}
            disabled={true}
          >
            {JSON.stringify(config, null, 2)}
          </textarea>
        </div>
      )}
    </div>
  );
}

function Photos({}) {
  return <div className="font-bold">photos comp</div>;
}
function Paragraph({ config }: { config: FieldType }) {
  const icon = config.ui_rules.icon_path ? config.ui_rules.icon_path.web : null;
  return (
    <div className="font-bold flex">
      {icon ? (
        <img
          src={`https://sl3-cdn.karousell.com/components/${icon}`}
          height={20}
        ></img>
      ) : null}
      <span className="ml-2">{config.meta.default_value}</span>
    </div>
  );
}

function LoanCalculator() {
  return (
    <div>
      <img width="400" src="/static/loan_calculator.png"></img>
    </div>
  );
}

function fetchData(url) {
  return fetch(url, {
    headers: {
      "cache-control": "no-cache",
      Connection: "keep-alive",
      Cookie: "__cfduid=ddfc872b15ac011de748470184ce98f051566967245",
      // Referer: "http://icetea.carousell.com/api/3.1/listings/106852/detail/",
      "Accept-Encoding": "gzip, deflate",
      Accept: "*/*",
      "User-Agent": "PostmanRuntime/7.16.3",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI5IiwiaXNzIjoiYyIsImlzc3VlZF9hdCI6MTU2ODAxNTEzMCwic2VjcmV0IjoiOTk1MiIsInVzZXIiOiJ3aWxzb250Z2gifQ.ac6KvxKWWctxJ0-Vqmr1qDW5LnaPKWcROEn4Bb6SAL8",
      "build-no": "3000",
      platform: "android",
      "X-Session-ID": "1212",
      "Postman-Token":
        "e2fc7460-6887-42ee-ae71-36fd8a9b29be,84123703-d0e6-4712-89c1-b6e3e9abbfdc",
      "Cache-Control": "no-cache"
    }
  }).then(function(response) {
    return response.json();
  });
}
const getInitialProps = async function() {
  const res = await fetchData(
    `https://icetea.carousell.com/api/3.1/listings/106852/detail/`
  ).then((data: any) => {
    return decodeToPromise(ScreenDecoder, data.screens[0])
      .then(decodedData => {
        // setData(decodedData);
        return decodedData;
      })
      .catch(error => {
        console.error(error);
        console.log("decode error");
      });
  });

  return {
    data: res
  };
};
export default Home;
