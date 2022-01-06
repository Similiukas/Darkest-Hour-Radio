# Simple tips on how it works

*(keep in mind, rasau po labai seniai naudojimo)*

## To start liquidsoap radio:

`sudo systemctl start ref-liquidsoap`

## To stop liquidsoap radio:

`sudo systemctl stop ref-liquidsoap`

## To restart:

`sudo systemctl restart ref-liquidsoap`

## To check status:

`sudo systemctl status`

## To create liquidsoap daemon:
While in `/liquidsoap-daemon` folder run:

`./daemonize-liquidsoap.sh ref`

*`ref.liq` file must in `/liquidsoap-daemon/script` folder*
