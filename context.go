package discussie

type Context struct {
	dmgr *Manager
}

func NewContext(dbFilename string) (*Context, error) {
	mgr, err := newManager(dbFilename)
	if err != nil {
		return nil, err
	}
	return &Context{dmgr: mgr}, nil
}
