const express = require("express");
const next = require("next");
const { exec } = require("child_process");
const fp = require("lodash/fp");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const fieldsetPath =
  "/Users/duc/Documents/carousell/FieldSetGenerator/staging/listing_details/0021_new_listing_detail";
const projectPath = "/Users/duc/Documents/carousell/FieldSetGenerator";
const path = require("path");
const fs = require("fs");
const syncStatus = {};

function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.log("error", err);
        // node couldn't execute the command
        reject(stderr);
        return;
      }
      resolve(stdout);
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  });
}
function getFiles() {
  return new Promise((resolve, reject) => {
    //joining path of directory
    const directoryPath = fieldsetPath;
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function(err, files) {
      //handling error
      if (err) {
        return console.log("Unable to scan directory: " + err);
      }
      //listing all files using forEach
      files.forEach(function(file) {
        // Do whatever you want to do with the file
        console.log(file);
      });
      resolve("done");
    });
  });
}
app.prepare().then(() => {
  const server = express();

  server.get("/api/json-files", (req, res) => {
    getFiles()
      .then(data => {
        console.log("data", data);
      })
      .catch(error => {
        console.log("error", error);
      })
      .finally(() => {
        res.send("Got a PUT request at /user");
      });
  });
  server.get("/api/open-file", (req, res) => {
    const fileName = req.query.file_name;
    const env = req.query.env === "prod" ? "prod" : "staging";
    if (fileName) {
      syncStatus[fileName] = true;
    }
    // res.send({ message: "success" });
    const filePath = `${env}/listing_details/0018_rebranding/${fileName}`;
    execCommand(`cd ${projectPath} && code ${filePath}`)
      .then(data => {
        res.send({ message: "success" });
      })
      .catch(error => {
        res.status(404).send({ message: `Failed ${error}` });
        // throw new Error(error);
      })
      .finally(() => {
        syncStatus[fileName] = false;
      });
  });
  server.get("/api/sync-file", (req, res) => {
    const fileName = req.query.file_name;
    const env = req.query.env === "prod" ? "prod" : "staging";
    if (fileName) {
      syncStatus[fileName] = true;
    }
    // res.send({ message: "success" });
    const filePath = `${env}/listing_details/0018_rebranding/${fileName}`;
    execCommand(
      `cd ${projectPath} && docker build . -t fsg && docker run fsg -c "python sync_all_fieldset_single_thread.py -e staging -c ${filePath}"`
    )
      .then(data => {
        res.send({ message: "success" });
      })
      .catch(error => {
        res.status(404).send({ message: `Failed ${error}` });
        // throw new Error(error);
      })
      .finally(() => {
        syncStatus[fileName] = false;
      });
  });
  server.get("/api/sync-status", (req, res) => {
    res.send(syncStatus);
  });

  // const stagingFiles = [
  //   "staging/listing_details/0018_rebranding/SGCarsCarsForSale_1233_android2375_ios1146_CarListingDetail.json",
  //   "staging/listing_details/0018_rebranding/SGCarsCommercialCarsForRent_2695_android2375_ios1146_CarListingDetail.json",
  //   "staging/listing_details/0018_rebranding/SGCarsNewCommercialCarsForSale_2694_android2375_ios1146_CarListingDetail.json",
  //   "staging/listing_details/0018_rebranding/SGCarsParallelImports_2316_android2375_ios1146_CarListingDetail.json",
  //   "staging/listing_details/0018_rebranding/SGCarsUsedCommercialCarsForSale_2696_android2375_ios1146_CarListingDetail.json",
  //   "staging/listing_details/0018_rebranding/SGCarsVehicleRentals_1241_android2375_ios1146_CarListingDetail.json",
  //   "staging/listing_details/0018_rebranding/SGNewCars_2562_android2375_ios1146_CarListingDetail.json",
  //   "staging/listing_details/0018_rebranding/SGMotorbikesClass2_1995_android2375_ios1146_CarListingDetail.json",
  //   "staging/listing_details/0018_rebranding/SGMotorbikesClass2A_1996_android2375_ios1146_CarListingDetail.json",
  //   "staging/listing_details/0018_rebranding/SGMotorbikesClass2B_1997_android2375_ios1146_CarListingDetail.json"
  // ];
  const stagingFiles = [
    "staging/listing_details/0021_new_listing_detail/SGForRentCommerce_1993_android2190_ios1095.json",
    "staging/listing_details/0021_new_listing_detail/SGForRentCondo_1991_android2190_ios1095.json",
    "staging/listing_details/0021_new_listing_detail/SGForRentHDB_1990_android2190_ios1095.json",
    "staging/listing_details/0021_new_listing_detail/SGForRentLanded_1992_android2190_ios1095.json",
    "staging/listing_details/0021_new_listing_detail/SGForRentroomRentals_1989_android2190_ios1095.json",
    "staging/listing_details/0021_new_listing_detail/SGForSaleCommerce_1988_android2190_ios1095.json",
    "staging/listing_details/0021_new_listing_detail/SGForSaleCondo_1986_android2190_ios1095.json",
    "staging/listing_details/0021_new_listing_detail/SGForSaleHDB_1985_android2190_ios1095.json",
    "staging/listing_details/0021_new_listing_detail/SGForSaleLanded_1987_android2190_ios1095.json"
  ];
  const stagingFilesFormated = fp.map(
    fp.flow(
      fp.split("/"),
      fp.last
    )
  )(stagingFiles);
  console.log(":aaa", stagingFilesFormated);
  // const prod = [
  //   "prod/listing_details/0018_rebranding/SGCarsCarsForSale_1233_android2375_ios1146_CarListingDetail.json",
  //   "prod/listing_details/0018_rebranding/SGCarsCommercialCarsForRent_2695_android2375_ios1146_CarListingDetail.json",
  //   "prod/listing_details/0018_rebranding/SGCarsNewCommercialCarsForSale_2694_android2375_ios1146_CarListingDetail.json",
  //   "prod/listing_details/0018_rebranding/SGCarsParallelImports_2316_android2375_ios1146_CarListingDetail.json",
  //   "prod/listing_details/0018_rebranding/SGCarsUsedCommercialCarsForSale_2696_android2375_ios1146_CarListingDetail.json",
  //   "prod/listing_details/0018_rebranding/SGCarsVehicleRentals_1241_android2375_ios1146_CarListingDetail.json",
  //   "prod/listing_details/0018_rebranding/SGNewCars_2562_android2375_ios1146_CarListingDetail.json",
  //   "prod/listing_details/0018_rebranding/SGMotorbikesClass2_1995_android2375_ios1146_CarListingDetail.json",
  //   "prod/listing_details/0018_rebranding/SGMotorbikesClass2A_1996_android2375_ios1146_CarListingDetail.json",
  //   "prod/listing_details/0018_rebranding/SGMotorbikesClass2B_1997_android2375_ios1146_CarListingDetail.json"
  // ];

  function copyStagingToProd() {
    return stagingFiles.map((filePath, index) => {
      const fileName = fp.flow(
        fp.split("/"),
        fp.last
      )(filePath);
      return new Promise((resolve, reject) => {
        fs.copyFile(
          `${projectPath}/${filePath}`,
          `${projectPath}/prod/listing_details/0018_rebranding/${fileName}`,
          error => {
            if (error) {
              console.log(`failed to copied ${fileName}`);
              console.log("error", error);
              reject(error);
            }
            resolve("success");
            console.log(`copied ${fileName}`);
          }
        );
      });
    });
  }
  server.get("/api/copy-stage-to-prod", (req, res) => {
    Promise.allSettled(copyStagingToProd())
      .then(resultArray => {
        console.log("test", resultArray);
        res.send({ message: "success" });
      })
      .catch(error => {
        res.status(500).send({ message: `Failed ${error}` });
      });
  });
  server.get("/api/sync-all", (req, res) => {
    execCommand(
      `cd ${projectPath} && docker build . -t fsg && docker run fsg -c "python sync_all_fieldset_single_thread.py -e staging -c ${stagingFiles.join(
        ","
      )}"`
    )
      .then(data => {
        res.send({ message: "success" });
      })
      .catch(error => {
        res.status(404).send({ message: `Failed ${error}` });
        // throw new Error(error);
      });
  });
  server.get("/api/make-local-test", (req, res) => {
    execCommand(`cd ${projectPath} && make local_test`)
      .then(data => {
        res.send({ message: "success" });
      })
      .catch(error => {
        res.status(404).send({ message: `Failed ${error}` });
        // throw new Error(error);
      });
  });
  server.get("api/get-files", (req, res) => {
    const stagingFilesFormated = fp.flow(
      fp.map,
      fp.split("/"),
      fp.last
    )(stagingFiles);
    console.log(":aaa");
    res.send({});
  });
  server.get("/api/get-fieldset", (req, res) => {
    const filePath = `${fieldsetPath}/${req.query.file_name}`;
    fs.access(filePath, fs.F_OK, err => {
      if (err) {
        console.error(err);
        res.status(404).send({ message: `Failed ${error}` });
        return;
        // throw new Error("File does not exist");
      }
      const content = fs.readFileSync(filePath, "utf8");
      res.send(content);
    });
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
