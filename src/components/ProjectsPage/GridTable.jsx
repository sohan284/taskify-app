import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Checkbox,
  Grid,
  NativeSelect,
  Typography,
} from "@mui/material";
import { FaRegEdit, FaRegStar, FaStar } from "react-icons/fa";
import { GoCopy } from "react-icons/go";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

function GridTable({
  members,
  page,
  rowsPerPage,
  selectedIds,
  handleSelect,
  visibleColumns,
  handleFavourite,
  handleOpenDialog,
  handleStatusChange,
  statuses,
  handleClickOpen,
}) {
  return (
    <Grid container spacing={2}>
      {members
        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        ?.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={member?.id}>
            <Card variant="outlined">
              <CardContent>
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={selectedIds?.includes(member?.id)}
                    onChange={() => handleSelect(member?.id)}
                  />
                  {visibleColumns?.id && (
                    <Typography>ID: {index + 1}</Typography>
                  )}
                </div>

                {visibleColumns?.title && (
                  <Typography variant="h6" color="primary">
                    {member?.title}
                  </Typography>
                )}

                <div className="flex items-center">
                  {member?.favourite ? (
                    <FaStar
                      onClick={() =>
                        handleFavourite(member, false, "Remove from Favourite")
                      }
                      className="text-[orange] mr-3"
                    />
                  ) : (
                    <FaRegStar
                      onClick={() =>
                        handleFavourite(member, true, "Added to favourite")
                      }
                      className="text-[orange] mr-3"
                    />
                  )}
                  <IoChatbubbleEllipsesOutline className="text-[tomato] text-[15px]" />
                </div>

                {visibleColumns?.users && (
                  <div className="flex items-center mt-2">
                    {Array.isArray(member?.users)
                      ? member?.users.map((el, index) => (
                          <div key={index} className="-ml-2">
                            {el?.photoURL ? (
                              <img
                                className="w-8 h-8 rounded-full border-[#5a6fe2] border-2"
                                src={el?.photoURL}
                              />
                            ) : (
                              <AccountCircleIcon className="text-[30px] bg-[#5a6fe2] rounded-full" />
                            )}
                          </div>
                        ))
                      : "No users"}
                    <FaRegEdit
                      className="ml-2 text-[#5a6fe2] cursor-pointer"
                      onClick={() => handleOpenDialog(member)}
                    />
                  </div>
                )}

                {visibleColumns?.clients && (
                  <div className="flex items-center mt-2">
                    {Array.isArray(member?.clients) &&
                    member?.clients.length > 0 ? (
                      member?.clients.map((el, index) => (
                        <div key={index} className="-ml-2">
                          {el?.photoURL ? (
                            <img
                              className="w-8 h-8 rounded-full border-[#5a6fe2] border-2"
                              src={el?.photoURL}
                            />
                          ) : (
                            <AccountCircleIcon className="text-[30px] bg-[#5a6fe2] rounded-full" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-white mt-1 rounded px-2 bg-[#5a6fe2]">
                        NOT ASSIGNED
                      </div>
                    )}
                    <FaRegEdit
                      className="ml-2 text-[#5a6fe2] cursor-pointer"
                      onClick={() => handleOpenDialog(member)}
                    />
                  </div>
                )}

                {visibleColumns?.status && (
                  <NativeSelect
                    value={member?.status?.title}
                    onChange={(e) => handleStatusChange(e, member)}
                    disableUnderline
                    style={{
                      backgroundColor: member?.status?.bgColor,
                      color: member?.status?.txColor,
                      width: "100%",
                      marginTop: "10px",
                    }}
                  >
                    {statuses?.map((status) => (
                      <option
                        key={status._id}
                        style={{
                          backgroundColor: status.bgColor,
                          color: status.txColor,
                        }}
                        value={status?.title}
                      >
                        {status?.title}
                      </option>
                    ))}
                  </NativeSelect>
                )}

                {visibleColumns?.priority && (
                  <Typography>Priority: {member?.priority}</Typography>
                )}
                {visibleColumns?.startsAt && (
                  <Typography>Starts At: {member?.startsAt}</Typography>
                )}
                {visibleColumns?.endsAt && (
                  <Typography>Ends At: {member?.endsAt}</Typography>
                )}
                {visibleColumns?.budget && (
                  <Typography>Budget: {member?.budget}</Typography>
                )}
                {visibleColumns?.tags && (
                  <Typography>Tags: {member?.tags?.join(", ")}</Typography>
                )}

                {visibleColumns?.options && (
                  <div className="flex justify-between mt-3">
                    <FaRegEdit
                      className="text-[#3f51b5] cursor-pointer"
                      onClick={() => handleOpenDialog(member)}
                    />
                    <RiDeleteBinLine
                      className="text-[tomato] cursor-pointer"
                      onClick={() => handleClickOpen(member?._id)}
                    />
                    <GoCopy className="text-[orange] cursor-pointer" />
                    <ErrorOutlineOutlinedIcon className="text-[#3f51b5]" />
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
}

GridTable.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      users: PropTypes.arrayOf(
        PropTypes.shape({
          photoURL: PropTypes.string,
        })
      ),
      clients: PropTypes.arrayOf(
        PropTypes.shape({
          photoURL: PropTypes.string,
        })
      ),
      favourite: PropTypes.bool,
      status: PropTypes.shape({
        title: PropTypes.string.isRequired,
        bgColor: PropTypes.string.isRequired,
        txColor: PropTypes.string.isRequired,
      }),
      priority: PropTypes.string,
      startsAt: PropTypes.string,
      endsAt: PropTypes.string,
      budget: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSelect: PropTypes.func.isRequired,
  visibleColumns: PropTypes.shape({
    id: PropTypes.bool,
    title: PropTypes.bool,
    users: PropTypes.bool,
    clients: PropTypes.bool,
    status: PropTypes.bool,
    priority: PropTypes.bool,
    startsAt: PropTypes.bool,
    endsAt: PropTypes.bool,
    budget: PropTypes.bool,
    tags: PropTypes.bool,
    options: PropTypes.bool,
  }).isRequired,
  handleFavourite: PropTypes.func.isRequired,
  handleOpenDialog: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  statuses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      bgColor: PropTypes.string.isRequired,
      txColor: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleClickOpen: PropTypes.func.isRequired,
};

export default GridTable;
